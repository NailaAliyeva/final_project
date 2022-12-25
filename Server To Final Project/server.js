const express = require('express');
const app = express();

const mysql = require('mysql');

const multer = require('multer');
const cors = require('cors');

const bcrypt = require('bcrypt');

const stringGenerator = require('./stringGenerator');

const users = [];

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'final_project_schema'
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/new/');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().getTime() + file.originalname);
    }
})

const upload = multer({ storage: storage });

app.use('/uploads', express.static('uploads/'));

app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3030;

app.post('/list/:listName', (req, res) => {
    let typeList = req.params.listName;
    const requestBody = {
        limit: req.body.limit || 6,
        page: req.body.page || 1,
        showCoin: req.body.showCoin,
    }
    pool.query('SELECT id, name, short_description, avers_img FROM coins_table WHERE coin_type = ? AND show_coin = ?', [typeList, requestBody.showCoin], (err, data) => {
        if (err) {
            res.status(500);
        } else {
            let correctData = dataCorrectorForList(data).splice((requestBody.page - 1) * requestBody.limit, requestBody.limit);
            pool.query('SELECT count(*) as count FROM coins_table WHERE coin_type = ? AND show_coin = 1', [typeList], (err, data) => {
                if (err) {
                    res.status(500);
                } else {
                    res.json([correctData, data[0].count]);
                }
            })
        }
    });
});

app.get('/restore/:id', (req, res) => {
    const coinId = req.params.id;
})

app.get('/coin/:id', (req, res) => {
    const coinId = req.params.id;
    pool.query('SELECT * FROM coins_table WHERE id = ?', [coinId], (err, data) => {
        if (!err) {
            if (data.length > 0) {
                let correctData = dataCorrectorForFullInfo(data[0]);
                res.json(correctData);
            } else {
                res.status(404).send();
            }
        } else {
            res.status(500).send();
        }
    });
})

app.get('/filter', (req, res) => {
    let data1 = '';
    let data2 = '';

    pool.query(`select issuing_country from coins_table group by issuing_country `, (err, data) => {
        if (!err) {
            data1 = data;
            pool.query(`select composition from coins_table group by composition`, (err, data) => {
                if (!err) {
                    data2 = data;
                    pool.query(`select quality from coins_table group by quality`, (err, data) => {
                        if (!err) {
                            data3 = data;
                            res.json([data1, data2, data3]);
                        } else {
                            res.status(500).send();
                        }
                    });
                } else {
                    res.status(500).send();
                }
            });
        } else {
            res.status(500).send();
        }
    });
})

app.post('/register', (req, res) => {
    const salt = bcrypt.genSaltSync(10);
    const { login, password } = req.body;

    pool.query('SELECT login FROM users where login = ?', [login], (err, data) => {
        if (!err) {
            if (data.length > 0) {
                res.status(409).send();
            } else {
                const hash = bcrypt.hashSync(password, salt);
                pool.query('INSERT INTO users (login, salt, hash) VALUES (?, ?, ?)', [login, salt, hash], (err, data) => {
                    if (!err) {
                        res.send({ login, hash });
                    } else {
                        res.status(500).send();
                    }
                });
            }
        } else {
            res.status(500).send();
        }
    });
});

app.delete('/token', (req, res) => {
    const { token } = req.body;
    pool.query('DELETE FROM users_token WHERE token = ?', [token], (err, data) => {
        if (!err) {
            res.status(200).send();
        } else {
            res.status(500).send();
        }
    })
})

app.put('/recycle-bin', (req, res) => {
    const { token, coinId, showCoin } = req.body;
    pool.query('SELECT * FROM users_token where token = ?', [token], (err, data) => {
        if (!err) {
            if (data.length !== 0) {
                if (data[0].status === 0) {
                    pool.query('UPDATE coins_table SET show_coin = ? WHERE id = ?', [showCoin, coinId], (err, data) => {
                        if (!err) {
                            res.status(200).send(data);
                        } else {
                            res.status(404).send("Coin not found");

                        }
                    });
                } else {
                    res.status(403).send();
                }
            } else {
                res.status(404).send();
            }
        } else {
            res.status(500).send();
        }
    })
})

app.get('/recycle-bin', (req, res) => {
    let coinsCount = {
        commemorative: 0,
        bullion: 0,
        exclusive: 0,
        allCount: 0,
    }

    let sql = "select coin_type, count(*) as count FROM coins_table where show_coin = 0 group by coin_type"

    pool.query(sql, (err, data) => {
        if (!err) {
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    switch (data[i].coin_type) {
                        case 'Commemorative': {
                            coinsCount.commemorative = data[i].count;
                            coinsCount.allCount += Number(data[i].count);
                            break;
                        }
                        case 'Bullion': {
                            coinsCount.bullion = data[i].count;
                            coinsCount.allCount += Number(data[i].count);
                            break;
                        }
                        case 'Exclusive': {
                            coinsCount.exclusive = data[i].count;
                            coinsCount.allCount += Number(data[i].count);
                            break;
                        }
                    }
                }
            }
            res.json(coinsCount);
        } else {
            res.status(500).send();
        }
    });
})


///////////////////////////////////////////////////////////////////////////////////////////

app.post('/collection', (req, res) => {

    // let requestBody = {
    //     coinId: req.body.coinId,
    //     token: req.body.token,
    //     name: name,
    //     shortDescription: req.body.shortDescription,
    //     aversImg: req.body.aversImg.split('uploads')[1];
    // }

    // pool.query('SELECT status FROM users_token WHERE token = ?', [reqBody.token], (err, data) => {
    //     if (!err) {
    //         if (data.length > 0 && Number(data[0].status) === 0) {
    //             pool.query(`UPDATE coins_table SET show_coin = 1 where show_coin = 0 AND coin_type = ?`, [reqBody.listName], (err, data) => {
    //                 if (!err) {
    //                     res.json(data);
    //                 } else {
    //                     res.status(400).send();
    //                 }
    //             });
    //         } else {
    //             res.status(403).send()
    //         }
    //     } else {
    //         res.status(500).send()
    //     }
    // })

});

///////////////////////////////////////////////////////////////////////////////////////////

app.put('/restore', (req, res) => {
    const reqBody = {
        token: req.body.token,
        listName: req.body.listName
    }
    pool.query('SELECT status FROM users_token WHERE token = ?', [reqBody.token], (err, data) => {
        if (!err) {
            if (data.length > 0 && Number(data[0].status) === 0) {
                pool.query(`UPDATE coins_table SET show_coin = 1 where show_coin = 0 AND coin_type = ?`, [reqBody.listName], (err, data) => {
                    if (!err) {
                        res.json(data);
                    } else {
                        res.status(400).send();
                    }
                });
            } else {
                res.status(403).send()
            }
        } else {
            res.status(500).send()
        }
    })
})

app.delete('/delete-all', (req, res) => {
    const reqBody = {
        token: req.body.token,
        listName: req.body.listName
    }
    pool.query('SELECT status FROM users_token WHERE token = ?', [reqBody.token], (err, data) => {
        if (!err) {
            if (data.length > 0 && Number(data[0].status) === 0) {
                pool.query(`DELETE FROM coins_table WHERE show_coin = 0 AND coin_type = ?`, [reqBody.listName], (err, data) => {
                    if (!err) {
                        res.json(data);
                    } else {
                        res.status(400).send();
                    }
                });
            } else {
                res.status(403).send()
            }
        } else {
            res.status(500).send()
        }
    })
})

app.post('/history', (req, res) => {
    const { token, coinId, name, shortDescription, aversImg } = req.body;
    let userId = 0;
    let correctAversImg = aversImg.split('uploads')[1];

    pool.query('SELECT user_id, status FROM users_token WHERE token = ?', [token], (err, data) => {
        if (!err) {
            if (data.length > 0) {
                userId = data[0].user_id;
                pool.query(`SELECT * FROM users_history WHERE user_id = ? AND coin_id = ?`, [userId, coinId], (err, data) => {
                    if (!err) {
                        if (data.length > 0) {
                            pool.query(`UPDATE users_history SET added_data = ? WHERE user_id = ? AND coin_id = ?`, [new Date(), userId, coinId], (err, data) => {
                                res.json(data);
                            });
                        } else {
                            pool.query(`INSERT INTO users_history (user_id, coin_id, name, short_description, avers_img) VALUES (?, ?, ?, ?, ?)`, [userId, coinId, name, shortDescription, correctAversImg], (err, data) => {
                                res.json(data);
                            });
                        }
                    } else {
                        res.status(400).send();
                    }
                });
            } else {
                res.status(403).send()
            }
        } else {
            res.status(500).send()
        }
    })
})

app.post('/get-history', (req, res) => {
    const { token } = req.body;

    pool.query('SELECT user_id, status FROM users_token WHERE token = ?', [token], (err, data) => {
        if (!err) {
            if (data.length > 0) {
                userId = data[0].user_id;
                pool.query(`SELECT * FROM users_history WHERE user_id = ?`, [userId], (err, data) => {
                    if (!err) {
                        let newDataArr = data.map(obj => {
                            return {
                                id: obj.id,
                                coinId: obj.coin_id,
                                name: obj.name,
                                shortDescription: obj.short_description,
                                addedData: obj.added_data,
                                aversImg: 'http://localhost:3030/uploads' + obj.avers_img
                            }
                        });

                        res.json(newDataArr);
                    } else {
                        res.status(400).send();
                    }
                });
            } else {
                res.status(403).send()
            }
        } else {
            res.status(500).send()
        }
    })

})

app.post('/login', (req, res) => {
    const { login, password } = req.body;
    pool.query('SELECT id, login, salt, hash, status FROM users WHERE login = ?', [login], (err, data) => {
        if (!err) {
            if (data.length === 0) {
                res.status(404).send();
            } else {
                const { id, login, salt, hash, status } = data[0];
                const newHash = bcrypt.hashSync(password, salt);

                if (newHash === hash) {
                    const newToken = stringGenerator();
                    pool.query('INSERT INTO users_token ( user_id, token, status) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE token = ?', [id, newToken, status, newToken], (err, data) => {
                        if (!err) {
                            res.send({
                                login,
                                token: newToken,
                                admin: status === 0 ? true : false
                            });
                        } else {
                            res.status(500).send();
                        }
                    });
                } else {
                    res.status(404).send();
                }
            }
        } else {
            res.status(500).send();
        }
    });
});

app.post('/coin', (req, res) => {
    const { token, coinData } = req.body;
    let { id, name, shortDescription, description, issuingCountry, composition, quality, denomination, year, weight, price, aversImg, reversImg, coinType } = coinData;

    aversImg = aversImg.split('uploads')[1];
    reversImg = reversImg.split('uploads')[1];

    pool.query('SELECT status FROM users_token WHERE token = ?', [token], (err, data) => {
        if (!err) {
            if (data.length > 0 && Number(data[0].status) === 0) {
                if (id === '') {
                    pool.query(`INSERT INTO coins_table (name, short_description, description, issuing_country, composition, quality, denomination, year, weight, price, avers_img, revers_img, coin_type, show_coin ) VALUES 
                    (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [name, shortDescription, description, issuingCountry, composition, quality, denomination, year, weight, price, aversImg, reversImg, coinType, 1], (err, data) => {
                        if (!err) {
                            res.json(data);
                        } else {
                            res.status(400).send();
                        }
                    });
                } else {
                    pool.query(`UPDATE coins_table SET name = ?, short_description = ?, description = ?, issuing_country = ?, composition = ?, quality = ?, denomination = ?, year = ?, weight = ?, price = ?, avers_img = ?, revers_img = ?, coin_type = ? where id = ? 
                    `, [name, shortDescription, description, issuingCountry, composition, quality, denomination, year, weight, price, aversImg, reversImg, coinType, id], (err, data) => {
                        if (!err) {
                            res.json(data);
                        } else {
                            res.status(400).send();
                        }
                    });
                }

            } else {
                res.status(403).send()
            }
        } else {
            res.status(500).send()
        }

    })
});

app.post('/search', (req, res) => {
    const requestBody = {
        searchText: req.body.searchText || '',
        issuingCountry: req.body.issuingCountry || '',
        composition: req.body.composition || '',
        quality: req.body.quality || '',
        priceFrom: req.body.priceFrom || '',
        priceTo: req.body.priceTo || '',
        yearFrom: req.body.yearFrom || '',
        yearTo: req.body.yearTo || '',
        limit: req.body.limit || 6,
        page: req.body.page || 0,
    }

    pool.query('SELECT * FROM coins_table WHERE show_coin = 1', (err, data) => {
        if (err) {
            res.status(500);
        } else {
            let resultData = searchResult(data, requestBody);
            let correctData = resultData.result.map(obj => { return dataCorrectorForFullInfo(obj) });
            correctData = correctData.splice((requestBody.page - 1) * requestBody.limit, requestBody.limit);
            resultData.result = correctData;
            res.json(resultData);
        }
    })
});

function searchResult(data, reqBody) {
    const { searchText, issuingCountry, composition, quality, priceFrom, priceTo, yearFrom, yearTo } = reqBody;
    let nameCount = 0;
    let shortDescCount = 0;
    let descCount = 0;
    let resultCount = 0;
    let result = [];
    result = data.filter(obj => {
        if (checkContains(searchText, obj.name)) {
            return obj;
        };
    })

    nameCount = result.length;
    data = data.filter((el) => !result.includes(el));
    result = result.concat(data.filter(obj => {
        if (checkContains(searchText, obj.short_description)) {
            return obj;
        };
    }))

    shortDescCount = result.length - nameCount;
    data = data.filter((el) => !result.includes(el));

    result = result.concat(data.filter(obj => {
        if (checkContains(searchText, obj.description)) {
            return obj;
        };
    }))

    descCount = result.length - shortDescCount - nameCount;

    //-------------------------------------------------------------------------------
    result = result.filter(obj => {
        if (checkContainsByFilter(issuingCountry, obj.issuing_country)) {
            return obj;
        };
    })

    result = result.filter(obj => {
        if (checkContainsByFilter(composition, obj.composition)) {
            return obj;
        };
    })

    result = result.filter(obj => {
        if (checkContainsByFilter(quality, obj.quality)) {
            return obj;
        };
    })

    result = result.filter(obj => {
        if (checkContainsByFromTo(priceFrom, priceTo, obj.price)) {
            return obj;
        };
    })

    result = result.filter(obj => {
        if (checkContainsByFromTo(yearFrom, yearTo, obj.year)) {
            return obj;
        };
    })


    resultCount = result.length;
    //-------------------------------------------------------------------------------

    return {
        result: result,
        nameCount: nameCount,
        shortDescCount: shortDescCount,
        descCount: descCount,
        resultCount: resultCount
    };
}

function checkContainsByFromTo(from, to, data) {
    let check = false;
    if (from === '' && to === '') {
        return true;
    } else if (from !== '' && to !== '') {
        if ((Number(data) >= Number(from)) && (Number(data) <= Number(to))) {
            check = true;
        }
    } else if (from !== '' && to === '') {
        if (Number(data) >= Number(from)) {
            check = true;
        }
    } else {
        if (Number(data) <= Number(to)) {
            check = true;
        }
    }
    return check;
}

function checkContainsByFilter(searchText, dataText) {
    let check = false;
    let inputVal = searchText.trim();
    if (dataText.search(new RegExp(inputVal, 'i')) === 0) {
        check = true;
    }
    return check;
}

function checkContains(searchText, dataText) {
    let check = false;
    let inputVal = searchText.trim();
    if (dataText.search(new RegExp(inputVal, 'i')) === 0) {
        check = true;
    }

    let arrayWords = dataText.split(' ');

    if (arrayWords.length > 1) {
        arrayWords.forEach(word => {
            if (word.search(new RegExp(inputVal, 'i')) === 0) {
                check = true;
            }
        });
    }

    return check;
}

function dataCorrectorForFullInfo(obj) {
    return {
        id: obj.id,
        name: obj.name,
        shortDescription: obj.short_description,
        description: obj.description,
        issuingCountry: obj.issuing_country,
        composition: obj.composition,
        quality: obj.quality,
        denomination: obj.denomination,
        year: obj.year,
        weight: obj.weight,
        price: obj.price,
        aversImg: 'http://localhost:3030/uploads' + obj.avers_img,
        reversImg: 'http://localhost:3030/uploads' + obj.revers_img,
        coinType: obj.coin_type,
        showCoin: obj.show_coin
    }
}

function dataCorrectorForList(data) {
    let newDataArr = data.map(obj => {
        return {
            id: obj.id,
            name: obj.name,
            shortDescription: obj.short_description,
            aversImg: 'http://localhost:3030/uploads' + obj.avers_img
        }
    })
    return newDataArr;
}

app.post('/upload', upload.single('photo'), (req, res) => {
    if (req.file) {
        res.json(req.file);
    }
    else throw 'error';
});

app.post('/path', upload.single('avatar'), function (req, res, next) {
    // res.file;
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
})


app.listen(port, () => { console.log('Started server at port ' + port); });
