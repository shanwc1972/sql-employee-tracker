const { Client } = require('pg');

async function employeedbQuery(strQuery) {
  
  // Define your database connection configuration
  const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',      
  password: 'ForceB/wu',  
  database: 'employees_db',  
  });  
  let resultData;
    
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
      
  // Define your database connection configuration
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',      
    password: 'ForceB/wu',  
    database: 'employees_db',  
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
        console.error('Insert error', err.stack);
      } else {
        //console.log('Insert result:', res.rows);
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

  // Define your database connection configuration
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',      
    password: 'ForceB/wu',  
    database: 'employees_db',  
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
              console.error('Insert error', err.stack);
            } else {
              //console.log('Insert result:', res.rows);
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

function addEmployee(strFName, strLName, strRole, strManager) {
    
  // Define your database connection configuration
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',      
    password: 'ForceB/wu',  
    database: 'employees_db',  
  });
  
  // Connect to the PostgreSQL database
  client.connect((err) => {
      if (err) {
          console.error('Connection error', err.stack);
          return;
      }
      // Lookup the id from the given role title
      return client.query(`SELECT id FROM role WHERE title = $1`, [strRole])
      .then(res1 => {
          if (res1.rows.length > 0) {
              const nameParts = strManager.split(' ');
              FirstName = nameParts[0];
              LastName = nameParts.slice(1).join('');
              return client.query(`SELECT id FROM employee WHERE first_name = $1
                  AND last_name = $2`, [FirstName, LastName])
              .then(res2 => {
                  if (res2.rows.length >0) {
                      let insertedValues = [strFName, strLName, res1.rows[0].id, res2.rows[0].id];
                      client.query(
                          `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                          VALUES  ($1, $2, $3, $4);`
                          , insertedValues, (err, res) => {
                              if (err) {
                                  console.error('Insert error', err.stack);
                                } else {
                                  //console.log('Insert result:', res.rows);
                                }
                                // Close the database connection
                                client.end((err) => {
                                  if (err) {
                                    console.error('Error closing connection', err.stack);
                                  };
                                })
                          })
                  } else {
                      return null; // Return null if no match found
                  }
              })
          } else {
              return null; // Return null if no match found
          }
      })
      .catch(err => {
          console.error('Error executing query', err.stack);
          throw err;
      });

  })
}

function updateEmployeeRole(strEmpName, strEmpRole) {
    
  // Define your database connection configuration
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',      
    password: 'ForceB/wu',  
    database: 'employees_db',
  });

  // Connect to the PostgreSQL database
  client.connect((err) => {
    if (err) {
        console.error('Connection error', err.stack);
        return;
      }

    // Lookup the id from the given role title
    return client.query(`SELECT id FROM role WHERE title = $1`, [strEmpRole])
    .then(res => {
      if (res.rows.length > 0) {
        const nameParts = strEmpName.split(' ');
        FirstName = nameParts[0];
        LastName = nameParts.slice(1).join('');
        return client.query(`SELECT id FROM employee WHERE first_name = $1
          AND last_name = $2`, [FirstName, LastName])
        .then(res2 => {
          let updateValues = [res.rows[0].id, res2.rows[0].id];
          client.query(
            `UPDATE employee SET role_id = $1 WHERE id = $2`
            , updateValues, (err, res) => {
            if (err) {
              console.error('Update error', err.stack);
            } else {
              //console.log('Update result:', res.rows);
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
        })
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

function deleteDepartment(strDepartment) {
      
  // Define your database connection configuration
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',      
    password: 'ForceB/wu',  
    database: 'employees_db',  
  });

  // Connect to the PostgreSQL database
  client.connect((err) => {
    if (err) {
        console.error('Connection error', err.stack);
        return;
      }

    return client.query(`SELECT id FROM department WHERE name = $1`, [strDepartment])
    .then(res => {
      if (res.rows.length > 0) {
        let deletedValues = [res.rows[0].id];
        // Execute a query
        client.query(
          //`DELETE FROM department WHERE id = $1;`, [deletedValues], (err, res) => {
          `DELETE FROM department WHERE id = ${deletedValues}`, (err, res) => {
            if (err) {
            console.error('Deletion error', err.stack);
          } else {
            //console.log('Deletion result:', res.rows);
          }

          // Close the database connection
          client.end((err) => {
            if (err) {
              console.error('Error closing connection', err.stack);
            }
          });
        });
      }else {
        return null; // Return null if no match found
      }
  })
  .catch(err => {
    console.error('Error executing query', err.stack);
    throw err;
  });
});
}

function deleteRole(strRole) {
      
  // Define your database connection configuration
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',      
    password: 'ForceB/wu',  
    database: 'employees_db',  
  });

  // Connect to the PostgreSQL database
  client.connect((err) => {
    if (err) {
        console.error('Connection error', err.stack);
        return;
      }

    return client.query(`SELECT id FROM role WHERE title = $1`, [strRole])
    .then(res => {
      if (res.rows.length > 0) {
        let deletedValues = [res.rows[0].id];
        // Execute a query
        client.query(
          `DELETE FROM role WHERE id = ${deletedValues}`, (err, res) => {
            if (err) {
            console.error('Deletion error', err.stack);
          } else {
            //console.log('Deletion result:', res.rows);
          }

          // Close the database connection
          client.end((err) => {
            if (err) {
              console.error('Error closing connection', err.stack);
            }
          });
        });
      }else {
        return null; // Return null if no match found
      }
  })
  .catch(err => {
    console.error('Error executing query', err.stack);
    throw err;
  });
});
}

function deleteEmployee(strEmployee) {
      
  // Define your database connection configuration
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',      
    password: 'ForceB/wu',  
    database: 'employees_db',  
  });

  // Connect to the PostgreSQL database
  client.connect((err) => {
    if (err) {
        console.error('Connection error', err.stack);
        return;
      }

    const nameParts = strEmployee.split(' ');
    FirstName = nameParts[0];
    LastName = nameParts.slice(1).join('');
    return client.query(`SELECT id FROM employee WHERE first_name = $1
        AND last_name = $2`, [FirstName, LastName])
    .then(res => {
      if (res.rows.length > 0) {
        let deletedValues = [res.rows[0].id];
        // Execute a query
        client.query(
          `DELETE FROM employee WHERE id = ${deletedValues}`, (err, res) => {
            if (err) {
            console.error('Deletion error', err.stack);
          } else {
            //console.log('Deletion result:', res.rows);
          }

          // Close the database connection
          client.end((err) => {
            if (err) {
              console.error('Error closing connection', err.stack);
            }
          });
        });
      }else {
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
  addRole,
  addEmployee,
  updateEmployeeRole,
  deleteDepartment,
  deleteRole,
  deleteEmployee
}