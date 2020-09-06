import mongoose from 'mongoose';
const pipeline_game_stats = (_id, currency, {from_date, to_date}) =>[
    {
        '$match': {
            'app': mongoose.Types.ObjectId(_id)
        }
    },
    {
        '$match': {
            "currency": mongoose.Types.ObjectId(currency)
        }
    },
    {
        '$match': {
            'timestamp': { '$gte': from_date, '$lte': to_date }
        }
    },
    {
        '$lookup': {
            'from': 'games',
            'localField': 'game',
            'foreignField': '_id',
            'as': 'game'
        }
    }, {
        '$unwind': {
            'path': '$game'
        }
    }, {
        '$group': {
            '_id': {
                '_id': '$game._id',
                'month': {
                    '$month': '$timestamp'
                },
                'year': {
                    '$year': '$timestamp'
                },
                'game': '$game',
                'name': '$game.name'
            },
            'betAmount': {
                '$sum': '$betAmount'
            },
            'betsAmount': {
                '$sum': 1
            },
            'paidAmount': {
                '$sum': '$winAmount'
            },
            'fees': {
                '$sum': '$fee'
            },
            'edge': {
                '$first': '$game.edge'
            }
        }
    }, {
        '$group': {
            '_id': {
                'month': '$_id.month',
                'year': '$_id.year'
            },
            'games': {
                '$push': {
                    '_id': '$_id._id',
                    'name': '$_id.name',
                    'edge': '$_id.edge',
                    'betsAmount': '$betAmount',
                    'betAmount': '$betsAmount',
                    'profit': {
                        '$subtract': [
                            '$betAmount', '$paidAmount'
                        ]
                    },
                    'fees': '$fees',
                    'edge': '$edge'
                }
            }
        }
    }, {
        '$project': {
            '_id': false,
            'date': {
                'month': '$_id.month',
                'year': '$_id.year'
            },
            'games': '$games'
        }
    }
];

export default pipeline_game_stats;