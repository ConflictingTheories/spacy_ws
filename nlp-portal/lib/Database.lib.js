/*                                            *\
** ------------------------------------------ **
**                 IOTA SERVER                **
** ------------------------------------------ **
**          Copyright (c) 2019           **
**              - Kyle Derby MacInnis         **
**                                            **
** Any unauthorized distribution or transfer  **
**    of this work is strictly prohibited.    **
**                                            **
**           All Rights Reserved.             **
** ------------------------------------------ **
\*                                            */

// MySQL Libary
// var SQL = require('mysql2');
var SQL = require('mysql');

// Environment Variables
// Environment Variables
const ENV = require('../etc/Env.conf.js');

// CONFIGURATION
const DB_HOST = ENV.DB_HOST;
const DB_USER = ENV.DB_USER;
const DB_PASS = ENV.DB_PASS;
const DB_NAME = ENV.DB_NAME;

// Connection
const DB_CLIENT = SQL.createPool({
    connectionLimit: 20,
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    acquireTimeout: 30000,
    connectTimeout: 30000,
    multipleStatements: true

});

console.log(DB_CLIENT);

// SQL.createConnection({
//     host: DB_HOST,
//     user: DB_USER,
//     password: DB_PASS,
//     database: DB_NAME
// });

// OBJECT
function Database() {
    let connection = null;
    let status = "closed";
    // Return Status
    function statusDB() {
        return status;
    }
    // Client
    function clientDB() {
        return DB_CLIENT;
    }
    // connection
    function connectionDB() {
        return connection;
    }
    // Connect
    function connectDB() {
        console.log("FETCHING CONNECTION:")
        return new Promise((resolve, reject) => {
            DB_CLIENT.getConnection((err, conn) => {
                if (err) {
                    console.log("ERROR::", err)
                    reject(err);
                } else {
                    console.log("CONNECTED");
                    resolve(conn);
                }
            });
        })
    };
    // Close
    function closeDB() {
        DB_CLIENT.close();
    };
    // Query (General)
    function queryDB(conn, query) {
        console.log("QUERYING DB", query)
        return new Promise((resolve, reject) => {
            conn.query(query, function(error, results, fields) {
                if (error)
                    reject(error);
                else
                    resolve({ results: results, fields: fields });
            });
        });
    };

    function escapeDB(value) {
        return SQL.escape(value);
    };

    function insertDB(table, inObject) {
        console.log("INSERT!", table, inObject);
        var values = [];
        var keys = [];
        for (i in inObject) {
            console.log(i);
            values.push(escapeDB(inObject[i]))
            keys.push(i);
        }
        console.log(keys.join(','));
        console.log(values.join(','));
        let query = "INSERT INTO " + table + " (" + keys.join(',') + ") VALUES (" + values.join(',') + ");";
        console.log(query);
        return query;
    };

    function updateDB(table, inObject, whObject, limit) {
        if (limit) {
            var _limit = " LIMIT " + parseInt(limit);
        } else {
            var _limit = "";
        }
        var values = [];
        for (i in inObject) {
            values.push(i + "=" + escapeDB(inObject[i]));
        }
        var whvalues = [];
        for (i in whObject) {
            whvalues.push(i + "=" + escapeDB(whObject[i]));
        }
        let query = "UPDATE " + table + " SET " + values.join(',') + " WHERE " + whvalues.join(' AND ') + _limit + ";";
        console.log(query);
        return query;
    };

    function deleteDB(table, whObject, limit) {
        if (limit) {
            var _limit = " LIMIT " + parseInt(limit);
        } else {
            var _limit = "";
        }
        var whvalues = [];
        for (i in whObject) {
            whvalues.push(i + "=" + escapeDB(whObject[i]))
        }
        let query = "DELETE FROM " + table + " WHERE " + whvalues.join(' AND ') + _limit + ";";
        return query;
    };

    function selectDB(search, table, whObject, limit) {
        if (limit) {
            var _limit = " LIMIT " + parseInt(limit);
        } else {
            var _limit = "";
        }
        var whvalues = [];
        for (i in whObject) {
            console.log(i);
            whvalues.push(i + "=" + escapeDB(whObject[i]))
        }
        console.log(whvalues, whvalues.length);
        if (whvalues.length >= 1) {
            var query = "SELECT " + search + " FROM " + table + " WHERE " + whvalues.join(' AND ') + _limit + ";";
        } else {
            var query = "SELECT " + search + " FROM " + table + _limit + ";";
        }
        console.log(query);
        return query;
    };

    function releaseDB(conn) {
        DB_CLIENT.releaseConnection(conn);
    };

    function joinDB(search, tables, whObject, limit) {
        if (limit) {
            var _limit = " LIMIT " + parseInt(limit);
        } else {
            var _limit = "";
        }
        var whvalues = [];
        for (let i in whObject) {
            console.log(i);
            whvalues.push(i + "=" + escapeDB(whObject[i]))
        }
        var joinvalues = [];
        for (let i of tables) {
            if (i == 0)
                joinvalues.push(tables[i]);
            else
                joinvalues.push(" JOIN " + tables[i]);
        }
        console.log(whvalues, whvalues.length);
        if (whvalues.length >= 1) {
            var query = "SELECT " + search + " FROM " + joinvalues.join("") + " WHERE " + whvalues.join(' AND ') + _limit + ";";
        } else {
            var query = "SELECT " + search + " FROM " + joinvalues.join("") + _limit + ";";
        }
        console.log(query);
        return query;
    };

    function _query(query) {
        return new Promise((resolve, reject) => {
            connectDB().then((conn) => {
                queryDB(conn, query)
                    .then((lookup) => {
                        releaseDB(conn);
                        resolve(lookup);
                    })
                    .catch((err) => {
                        releaseDB(conn);
                        reject(err);
                    });
            }).catch((err) => {
                console.error(err)
                reject(err);
            });
        });
    }

    function _insert(table, inObject) {
        return new Promise((resolve, reject) => {
            let query = insertDB(table, inObject);
            console.log("--INSERTING--");
            connectDB().then((conn) => {
                queryDB(conn, query)
                    .then((lookup) => {
                        console.log("--CONNECTION CLOSED--")
                        releaseDB(conn);
                        resolve(lookup);
                    })
                    .catch((err) => {
                        console.log("--ERROR--", err);
                        releaseDB(conn);
                        reject(err);
                    });
            }).catch((err) => {
                console.error(err)
                reject(err);
            });
        });
    }

    function _update(table, inObject, whObject, limit) {
        return new Promise((resolve, reject) => {
            let userQuery = updateDB(table, inObject, whObject, limit);
            connectDB().then((conn) => {
                queryDB(conn, userQuery)
                    .then((lookup) => {
                        releaseDB(conn);
                        resolve(lookup);
                    })
                    .catch((err) => {
                        releaseDB(conn);
                        reject(err);
                    });
            }).catch((err) => {
                console.error(err)
                reject(err);
            });
        });
    }

    function _select(search, table, whObject, limit) {
        return new Promise((resolve, reject) => {
            let userQuery = selectDB(search, table, whObject, limit);
            connectDB().then((conn) => {
                queryDB(conn, userQuery)
                    .then((lookup) => {
                        releaseDB(conn);
                        resolve(lookup);
                    })
                    .catch((err) => {
                        releaseDB(conn);
                        reject(err);
                    });
            }).catch((err) => {
                console.error(err)
                reject(err);
            });
        });
    }

    function _join(search, tables, whObject, limit) {
        return new Promise((resolve, reject) => {
            let userQuery = joinDB(search, tables, whObject, limit);
            connectDB().then((conn) => {
                queryDB(conn, userQuery)
                    .then((lookup) => {
                        releaseDB(conn);
                        resolve(lookup);
                    })
                    .catch((err) => {
                        releaseDB(conn);
                        reject(err);
                    });
            }).catch((err) => {
                console.error(err)
                reject(err);
            });
        });
    }

    function _delete(table, whObject, limit) {
        return new Promise((resolve, reject) => {
            let query = deleteDB(table, whObject, limit);
            connectDB().then((conn) => {
                queryDB(conn, query)
                    .then((lookup) => {
                        releaseDB(conn);
                        resolve(lookup);
                    })
                    .catch((err) => {
                        releaseDB(conn);
                        reject(err);
                    });
            }).catch((err) => {
                console.error(err)
                reject(err);
            });
        });
    }

    // Object Returned
    return {
        status: statusDB,
        client: clientDB,
        connect: connectDB,
        close: closeDB,
        connection: connectionDB,
        // Query Builders
        escape: escapeDB,
        insertQuery: insertDB,
        updateQuery: updateDB,
        deleteQuery: deleteDB,
        selectQuery: selectDB,
        // Complete Encapsulated Functions
        query: _query,
        insert: _insert,
        update: _update,
        delete: _delete,
        select: _select,
        join: _join
    };
}

// Export
module.exports = Database();