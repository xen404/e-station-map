const pool = require("../dbConnection");

module.exports = (app) => {
  app.get("/station/cluster", async (req, res) => {
    const { filters, isAvailable } = req.query;
    const onlyAvailable = isAvailable === "true" ? true : false;
    const filtersArray = filters ? filters.split(",") : [];
    const filterCondition = filtersArray.length
      ? `JOIN plug ON plug.stationId = station.stationId WHERE plug.plugType IN (${filtersArray
          .map((type) => `'${type}'`)
          .join(",")})`
      : "";

    const onlyAvailableCondition = onlyAvailable
      ? ` AND EXISTS (
      SELECT 1 FROM plugstatus
      WHERE plugstatus.plugId = plug.plugId
      AND plugstatus.status = 'available'
    )`
      : "";

    const stations = await pool.query(
      `SELECT DISTINCT station.*
   FROM station
   WHERE station.stationId != 78264
   AND station.stationId != 87262
   ${filterCondition}
   ${onlyAvailableCondition};`
    );

    res.send(stations.rows);
  });

  app.get("/station/inbounds", async (req, res) => {
    try {
      const { nelat, nelon, swlat, swlon, date, filters } = req.query;
      const requestDate = new Date(date);
      const dateFrom = new Date(requestDate);
      const dateFromAsString = `${requestDate.getFullYear()}-${
        requestDate.getMonth() + 1
      }-${requestDate.getDate()} ${requestDate.getHours()}:${requestDate.getMinutes()}`;

      const dateTo = new Date(dateFrom.setMinutes(dateFrom.getMinutes() - 30));
      const dateToAsString = `${dateTo.getFullYear()}-${
        dateTo.getMonth() + 1
      }-${dateTo.getDate()} ${dateTo.getHours()}:${dateTo.getMinutes()}`;

      const stationsInBounds = await pool.query(
        `SELECT *
         FROM station
         WHERE station.coord && ST_MakeEnvelope( ${nelon}, ${nelat}, ${swlon}, ${swlat}, 4326);`
      );
      if (stationsInBounds.rows && stationsInBounds.rows.length) {
        const stationIds = stationsInBounds.rows.map((s) => s.stationid);

        // Modify the plugs query to filter by plug types
        const filtersArray = filters ? filters.split(",") : [];
        const filterCondition = filtersArray.length
          ? `AND p.plugType IN (${filtersArray
              .map((type) => `'${type}'`)
              .join(",")})`
          : "";
        const plugs = await pool.query(
          `SELECT s.stationId, p.plugId, p.plugtype, p.power, pstat.status
          FROM Station s LEFT JOIN 
            Plug p ON p.stationId = s.stationId LEFT JOIN LATERAL (
              SELECT plugId, timestamp, status
              FROM Plugstatus pstat
              WHERE timestamp >= '${dateToAsString}' AND timestamp <= '${dateFromAsString}' AND
                 plugid = p.plugid
                 GROUP BY timestamp, p.plugId, pstat.plugId, pstat.status
                 ORDER BY timestamp
                 LIMIT 1
         ) pstat ON true
         WHERE s.stationId = ANY(ARRAY[${stationIds}])
         ${filterCondition}
         GROUP BY s.stationId, p.plugId, pstat.status;`
        );

        const result = plugs.rows.reduce(function (r, a) {
          r[a.stationid] = r[a.stationid] || [];
          r[a.stationid].push(a);
          return r;
        }, Object.create(null));

        const response = stationsInBounds.rows.map((station) => {
          return {
            ...station,
            plugs: result[station.stationid],
          };
        });
        res.send(response);
      } else {
        res.send(stationsInBounds.rows);
      }
    } catch (e) {
      console.log("ERROR", e);
    }
  });

  app.get("/station/info", async (req, res) => {
    try {
      const { stationId, date } = req.query;
      const requestDate = new Date(date);
      const newDate = `${requestDate.getFullYear()}-${
        requestDate.getMonth() + 1
      }-${requestDate.getDate()} ${requestDate.getHours()}:${requestDate.getMinutes()}`;
      const stationInfo = await pool.query(
        `SELECT s.stationId, s.name, s.street, s.zipcode, s.lat, s.lng, p.plugId,
                p.plugtype, p.power, pstat.statusId, pstat.timestamp, pstat.status
         FROM Station s LEFT JOIN 
                Plug p ON p.stationId = s.stationId LEFT JOIN LATERAL (
                  SELECT statusId, timestamp, status
                  FROM Plugstatus pstat
                  WHERE timestamp >= '${newDate}' AND
                     plugid = p.plugid
               ORDER BY timestamp
               LIMIT 1
             ) pstat ON true
        WHERE s.stationId = ${stationId}`
      );

      if (stationInfo.rows && stationInfo.rows.length) {
        const { stationid, name, street, zipcode } = stationInfo.rows[0];

        const stationPlugsInfo = stationInfo.rows.map((s) => {
          return {
            plugid: s.plugid,
            plugType: s.plugtype,
            power: s.power,
            statusid: s.statusid,
            status: s.status,
          };
        });

        const stationInfoFormatted = {
          stationid,
          name,
          street,
          zipcode,
          plugs: stationPlugsInfo,
        };
        res.send(stationInfoFormatted);
      } else {
        res.send(stationInfo.rows);
      }
    } catch (e) {
      console.log("ERROR", e);
    }
  });
};
