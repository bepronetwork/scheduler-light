import mongoose from 'mongoose';

const pipeline_last_bets_esports = (_id, { size }) =>
    [
        {
            '$match': {
                'app': typeof _id == 'string' ? mongoose.Types.ObjectId(_id) : _id
            }
        }, {
            '$sort': {
                'created_at': -1
            }
        }, {
            '$limit': size
        }, {
            '$lookup': {
                'from': 'users',
                'localField': 'user',
                'foreignField': '_id',
                'as': 'user'
            }
        }, {
            '$unwind': {
                'path': '$user'
            }
        }, {
            '$lookup': {
                'from': 'videogames',
                'localField': 'videogames',
                'foreignField': '_id',
                'as': 'videogames'
            }
        }, {
            '$lookup': {
                'from': 'currencies',
                'localField': 'currency',
                'foreignField': '_id',
                'as': 'currency'
            }
        }, {
            '$unwind': {
                'path': '$currency'
            }
        }, {
            '$project': {
                'bet': {
                    '_id': '$_id',
                    'betAmount': '$betAmount',
                    'winAmount': '$winAmount',
                    'isWon': '$isWon',
                    'timestamp': '$created_at'
                },
                'currency': {
                    '_id': '$currency._id',
                    'ticker': '$currency.ticker',
                    'name': '$currency.name',
                    'image': '$currency.image'
                },
                'user': {
                    '_id': '$user._id',
                    'username': '$user.username'
                },
                'game': '$videogames'
            }
        }
    ]

export default pipeline_last_bets_esports;