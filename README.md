### e-station-map Project

### Introduction
This project utilizes a React frontend, a Node.js + Express backend, and a PostgreSQL database initialized by a Python script. This README will guide you through setting up the project from scratch.

### Getting Started

#### 1. Clone the Repository
Begin by cloning the e-station-map-data repository into the root folder of the project:
git clone [repository_link] e-station-map-data


### Setting Up the Database

#### 2. Install PostgreSQL

For macOS:
brew install postgresql


For Ubuntu:
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib


#### 3. Start PostgreSQL

For macOS:
brew services start postgresql


For Ubuntu:
sudo service postgresql start


#### 4. Create a Superuser for PostgreSQL

Replace anton with your desired username:
createuser -s anton


#### 5. Create a Database

Replace new_db with your desired database name:
createdb new_db


#### 6. Add the Geography Type

Connect to the database:
psql -d new_db -U anton


And then run the following:
CREATE EXTENSION postgis;


Exit with:
\q


### Python Environment and Libraries

#### 7. Install psycopg2

Ensure you have pip installed and run:
pip install psycopg2


#### 8. Set up the libpq Path (for macOS users)

Find the location of libpq.5.dylib (usually in the Postgres lib directory) and add it to the DYLD_LIBRARY_PATH:
export DYLD_LIBRARY_PATH=/usr/local/opt/postgresql/lib/postgresql@14:$DYLD_LIBRARY_PATH

*Note*: This step ensures that the Python script can communicate with the PostgreSQL server.

#### 9. Initialize the Database
You can run the provided create_db.py script to initialize your database.

In Line 123:
with psycopg2.connect("dbname=new_db user=anton") as conn:

Replace dbname and user with your postgresql database and user.

If you want to seed the database with a smaller sample, modify line 15 of the script.

FROM: with open('data/station_sample.json') as f:

TO: with open('data/station_sample_demo.json') as f:

### Hints & Tips

- Ensure you have all necessary permissions for creating and modifying the database.
- For further customizations, you can modify the create_db.py script as needed.

---

## Frontend (React) Setup: ba_frontend

### Prerequisites

#### 1. Install Node.js and npm:

Before you can run a React project, you need to have Node.js and npm (Node Package Manager) installed.

- macOS:
  bash
  brew install node
  

- Ubuntu:
  bash
  sudo apt update
  sudo apt install nodejs npm
  

To confirm the installations:
node -v
npm -v


### Setup and Run the Frontend:

#### 2. Navigate to the ba_frontend directory:
cd ba_frontend


#### 3. Install Dependencies:
This will read the package.json file and install all necessary dependencies for the React app.
npm install


#### 4. Start the React App:
npm run start


The React app should now be running on http://localhost:3000.

---

## Backend (Node + Express) Setup: ba_backend

### Prerequisites

*If you followed the frontend setup, you already have these installed.*

#### 1. Install Node.js and npm:

- macOS:
  bash
  brew install node
  

- Ubuntu:
  bash
  sudo apt update
  sudo apt install nodejs npm
  

To confirm the installations:
node -v
npm -v


### Setup and Run the Backend:

#### 2. Navigate to the ba_backend directory:
cd ba_backend


#### 3. Install Dependencies:
This will read the package.json file and install all necessary dependencies for the Node + Express backend.
npm install


#### 4. Start the Backend Server:
node index.js


---