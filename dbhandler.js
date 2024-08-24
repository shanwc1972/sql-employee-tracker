async function employeedbQuery(strQuery) {
  const { Client } = require('pg');
    let resultData;
    
    // Define your database connection configuration
    const client = new Client({
      host: 'localhost',
      port: 5432,
      user: 'postgres',      // Replace with your database username
      password: 'ForceB/wu',  // Replace with your database password
      database: 'employees_db',  // Replace with your database name
    });
    
    try {
      // Connect to the PostgreSQL database
      await client.connect();
      //console.log('Connected to the database');
       
      // Execute the query
      const res = await client.query(
      strQuery);
      resultData = res.rows; // Store the query result in a variable

    } catch (err) {
    console.error('Error during database operation', err.stack);
    } finally {
    // Close the database connection
    await client.end();
    }
      
    return resultData;
}

function addDepartment(strDepartment) {

  const { Client } = require('pg');
      
  // Define your database connection configuration
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',      // Replace with your database username
    password: 'ForceB/wu',  // Replace with your database password
    database: 'employees_db',  // Replace with your database name
  });

  // Connect to the PostgreSQL database
  client.connect((err) => {
    if (err) {
        console.error('Connection error', err.stack);
        return;
      }

    // Execute a query
    client.query(
      `INSERT INTO department (name)
      VALUES  ($1);`, [strDepartment], (err, res) => {
      if (err) {
        console.error('Query error', err.stack);
      } else {
        console.log('Query result:', res.rows);
      }

      // Close the database connection
      client.end((err) => {
        if (err) {
          console.error('Error closing connection', err.stack);
        }
      });
    });
  });
}

function addRole(strTitle, nSalary, strDepartment) {

  const { Client } = require('pg');
      
  // Define your database connection configuration
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',      // Replace with your database username
    password: 'ForceB/wu',  // Replace with your database password
    database: 'employees_db',  // Replace with your database name
  });

  // Connect to the PostgreSQL database
  client.connect((err) => {
    if (err) {
        console.error('Connection error', err.stack);
        return;
      }

    // Lookup the id from the given department name
    return client.query(`SELECT id FROM department WHERE name = $1`, [strDepartment])
    .then(res => {
      if (res.rows.length > 0) {
        let insertedValues = [strTitle, nSalary, res.rows[0].id];
        client.query(
          `INSERT INTO role (title, salary, department)
          VALUES  ($1, $2, $3);`
          , insertedValues, (err, res) => {
            if (err) {
              console.error('Query error', err.stack);
            } else {
              console.log('Query result:', res.rows);
            }
            // Close the database connection
            client.end((err) => {
              if (err) {
                console.error('Error closing connection', err.stack);
                }
              }
            )
          }
        )
      } else {
        return null; // Return null if no match found
      }
    })
    .catch(err => {
      console.error('Error executing query', err.stack);
      throw err;
    });
  });
}

module.exports = {
  employeedbQuery,
  addDepartment,
  addRole
}