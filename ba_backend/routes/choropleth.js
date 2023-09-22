const pool = require("../dbConnection");
const NUTS1 = require("../Nuts1");
const NUTS2 = require("../Nuts2");
const NUTS3 = require("../Nuts3");

module.exports = (app) => {
  app.get("/choropleth/NUTS1", async (req, res, next) => {
    try {
      const { date } = req.query;
      const requestDate = new Date(date);

      const nuts1Regions = await pool.query(
        `SELECT 
        ${generateSumQueryLine(NUTS1, 1)}
        from station
        `
      );
      const freeStations = await getFreeStationsAtTimepoint(
        NUTS1,
        1,
        requestDate
      );

      addFreeStationsAndPlugsToNutGeoJSON(NUTS1, freeStations.rows);
      addNumberOfStationsToNutGeoJSON(NUTS1, nuts1Regions.rows[0]);
      res.send(NUTS1);
    } catch (e) {
      console.log(e);
      next(e);
    }
  });

  app.get("/choropleth/NUTS2", async (req, res, next) => {
    try {
      const { date } = req.query;
      const requestDate = new Date(date);

      const nuts2Regions = await pool.query(
        `SELECT 
        ${generateSumQueryLine(NUTS2, 2)}
        from station
        `
      );
      const freeStations = await getFreeStationsAtTimepoint(
        NUTS2,
        2,
        requestDate
      );

      addFreeStationsAndPlugsToNutGeoJSON(NUTS2, freeStations.rows);
      addNumberOfStationsToNutGeoJSON(NUTS2, nuts2Regions.rows[0]);
      res.send(NUTS2);
    } catch (e) {
      console.log(e);
      next(e);
    }
  });

  app.get("/choropleth/NUTS3", async (req, res, next) => {
    try {
      const { date } = req.query;
      const requestDate = new Date(date);

      const nuts3Regions = await pool.query(
        `SELECT 
      ${generateSumQueryLine(NUTS3, 3)}
      from station
      `
      );

      const freeStations = await getFreeStationsAtTimepoint(
        NUTS3,
        3,
        requestDate
      );

      addFreeStationsAndPlugsToNutGeoJSON(NUTS3, freeStations.rows);
      addNumberOfStationsToNutGeoJSON(NUTS3, nuts3Regions.rows[0]);

      res.send(NUTS3);
    } catch (e) {
      console.log(e);
      next(e);
    }
  });
};

const getFreeStationsAtTimepoint = async (nuts, lvl, date) => {
  try {
    const nutsIds = nuts.map((n) => n.properties.NUTS_ID).join();

    const dateFrom = new Date(date);
    const dateFromAsString = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;

    const dateTo = new Date(dateFrom.setMinutes(dateFrom.getMinutes() - 30));
    const dateToAsString = `${dateTo.getFullYear()}-${
      dateTo.getMonth() + 1
    }-${dateTo.getDate()} ${dateTo.getHours()}:${dateTo.getMinutes()}`;

    const freeStationsAndPlugs =
      await pool.query(`SELECT nuts${lvl}, COUNT(DISTINCT s.stationId) AS "freeStations", COUNT(p.plugId) AS "freePlugs"
                        FROM station s INNER JOIN plug p ON (s.stationId = p.stationId)
                                       INNER JOIN (
                                          SELECT max(timestamp), status, plugId
                                          FROM plugstatus 
                                          WHERE timestamp >= '${dateToAsString}' AND timestamp <= '${dateFromAsString}'
                                          AND status = 'available'
                                          GROUP BY status, plugId
                                      ) ps ON(ps.plugId = p.plugId) 
                        WHERE nuts${lvl} = ANY ('{${nutsIds}}')
                        GROUP BY nuts${lvl}`);
    return freeStationsAndPlugs;
  } catch (e) {
    console.log(e);
  }
};

const generateSumQueryLine = (nuts, lvl) => {
  try {
    const nutsIdArr = nuts.map((n) => n.properties.NUTS_ID);

    let query = "";
    nutsIdArr.forEach((id) => {
      query = query.concat(
        `sum(case when nuts${lvl}  = '${id}' then 1 else 0 end) as ${id}, `
      );
    });

    queryWithoutLastComma = query.substring(0, query.length - 2);
    return queryWithoutLastComma;
  } catch (e) {
    console.log(e);
  }
};

const addNumberOfStationsToNutGeoJSON = (nutGeoJSON, numberOfStations) => {
  nutGeoJSON.forEach((nut) => {
    nut.properties[`stationsTotal`] =
      numberOfStations[nut.properties.NUTS_ID.toLowerCase()];
  });
};

const addFreeStationsAndPlugsToNutGeoJSON = (nutGeoJSON, numberOfStations) => {
  nutGeoJSON.forEach((nut) => {
    const freeStationsAndPlugsProNut = numberOfStations.find((n) => {
      return n[`nuts${nut.properties.LEVL_CODE}`] === nut.properties.NUTS_ID;
    });
    if (
      freeStationsAndPlugsProNut &&
      freeStationsAndPlugsProNut.freeStations &&
      freeStationsAndPlugsProNut.freePlugs
    ) {
      nut.properties[`freeStations`] = freeStationsAndPlugsProNut.freeStations;
      nut.properties[`freePlugs`] = freeStationsAndPlugsProNut.freePlugs;
    } else {
      nut.properties[`freeStations`] = -1;
      nut.properties[`freePlugs`] = -1;
    }
  });
};
