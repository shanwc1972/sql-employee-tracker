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

  client.connect()
    .then(() => {
      // Lookup the id from the given department name
      return client.query(`INSERT INTO department (name) VALUES ($1)`, [strDepartment]);
    })
    .then(() => {
      console.log('Department added successfully');
    })
    .catch(err => {
      console.error('Error executing query', err.stack);
    })
    .finally(() => {
      // Close the database connection
      client.end(err => {
        if (err) {
          console.error('Error closing connection', err.stack);
        }
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
  client.connect()
    .then(() => {
      // Lookup the id from the given department name
      return client.query('SELECT id FROM department WHERE name = $1', [strDepartment]);
    })
    .then(res => {
      if (res.rows.length > 0) {
        const departmentId = res.rows[0].id;
        const insertedValues = [strTitle, nSalary, departmentId];
        return client.query(
          `INSERT INTO role (title, salary, department)
           VALUES ($1, $2, $3)`,
          insertedValues
        );
      } else {
        throw new Error('Department not found');
      }
    })
    .then(() => {
      console.log('Role added successfully');
    })
    .catch(err => {
      console.error('Error executing query', err.stack);
    })
    .finally(() => {
      // Close the database connection
      client.end(err => {
        if (err) {
          console.error('Error closing connection', err.stack);
        }
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
  client.connect()
  .then(() => {
    // Lookup the id from the given role title
    return client.query(`SELECT id FROM role WHERE title = $1`, [strRole]);
  })
  .then(res1 => {
    if (res1.rows.length === 0) {
      throw new Error('Role not found');
    }
    
    const roleId = res1.rows[0].id;
     if (!strManager) {
      return { roleId, managerId: null };
    }

    const nameParts = strManager.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');

    // Lookup the id from the given manager's name
    return client.query(
      `SELECT id FROM employee WHERE first_name = $1 AND last_name = $2`,
      [firstName, lastName]
    ).then(res2 => {
      if (res2.rows.length === 0) {
        throw new Error('Manager not found');
      }
        
      return { roleId, managerId: res2.rows[0].id };
    });
  })
  .then(({ roleId, managerId }) => {
    const insertedValues = [strFName, strLName, roleId, managerId];
    return client.query(
      `INSERT INTO employee (first_name, last_name, role_id, manager_id)
       VALUES ($1, $2, $3, $4)`,
      insertedValues
    );
  })
  .then(() => {
    console.log('Employee added successfully');
  })
  .catch(err => {
    console.error('Error:', err.message);
  })
  .finally(() => {
    // Close the database connection
    client.end(err => {
      if (err) {
        console.error('Error closing connection', err.stack);
      }
    });
  });
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
  client.connect()
  .then(() => {
    // Lookup the id from the given role title
    return client.query(`SELECT id FROM role WHERE title = $1`, [strEmpRole]);
  })
  .then(res => {
    if (res.rows.length === 0) {
      throw new Error('Role not found');
    }

    const roleId = res.rows[0].id;

    const nameParts = strEmpName.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');

    // Lookup the id from the given employee's name
    return client.query(
      `SELECT id FROM employee WHERE first_name = $1 AND last_name = $2`,
      [firstName, lastName]
    ).then(res2 => {
      if (res2.rows.length === 0) {
        throw new Error('Employee not found');
      }

      const employeeId = res2.rows[0].id;
      return { roleId, employeeId };
    });
  })
  .then(({ roleId, employeeId }) => {
    return client.query(
      `UPDATE employee SET role_id = $1 WHERE id = $2`,
      [roleId, employeeId]
    );
  })
  .then(() => {
    console.log('Employee role updated successfully');
  })
  .catch(err => {
    console.error('Error:', err.message);
  })
  .finally(() => {
    // Close the database connection
    client.end(err => {
      if (err) {
        console.error('Error closing connection', err.stack);
      }
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
  client.connect()
    .then(() => {
      // Find the department ID
      return client.query(`SELECT id FROM department WHERE name = $1`, [strDepartment]);
    })
    .then(res => {
      if (res.rows.length === 0) {
        throw new Error('Department not found');
      }

      const departmentId = res.rows[0].id;
      // Delete the department
      return client.query(`DELETE FROM department WHERE id = $1`, [departmentId]);
    })
    .then(() => {
      console.log('Department deleted successfully');
    })
    .catch(err => {
      console.error('Error:', err.message);
    })
    .finally(() => {
      // Close the database connection
      client.end(err => {
        if (err) {
          console.error('Error closing connection', err.stack);
        }
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
  client.connect()
    .then(() => {
      // Find the department ID
      return client.query(`SELECT id FROM role WHERE title = $1`, [strRole]);
    })
    .then(res => {
      if (res.rows.length === 0) {
        throw new Error('Role not found');
      }

      const roleId = res.rows[0].id;
      // Delete the role
      return client.query(`DELETE FROM role WHERE id = $1`, [roleId]);
    })
    .then(() => {
      console.log('Role deleted successfully');
    })
    .catch(err => {
      console.error('Error:', err.message);
    })
    .finally(() => {
      // Close the database connection
      client.end(err => {
        if (err) {
          console.error('Error closing connection', err.stack);
        }
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
  client.connect()
    .then(() => {
      // Find the employee ID
      const nameParts = strEmployee.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ');
      return client.query(`SELECT id FROM employee WHERE first_name = $1 AND last_name = $2`, [firstName, lastName]);
    })
    .then(res => {
      if (res.rows.length === 0) {
        throw new Error('Employee not found');
      }

      const employeeId = res.rows[0].id;
      // Delete the employee
      return client.query(`DELETE FROM employee WHERE id = $1`, [employeeId]);
    })
    .then(() => {
      console.log('Employee deleted successfully');
    })
    .catch(err => {
      console.error('Error:', err.message);
    })
    .finally(() => {
      // Close the database connection
      client.end(err => {
        if (err) {
          console.error('Error closing connection', err.stack);
        }
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