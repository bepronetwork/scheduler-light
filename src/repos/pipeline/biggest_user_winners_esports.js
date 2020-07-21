import mongoose from 'mongoose';

const pipeline_biggest_user_winners_esports = (_id, { size }) =>
    [
        {
            '$match': {
                'app': typeof _id == 'string' ? mongoose.Types.ObjectId(_id) : _id
            }
        }, {
            '$group': {
                '_id': '$user',
                'winAmount': {
                    '$sum': '$winAmount'
                },
                'currency': {
                    '$first': '$currency'
                },
                'videogames': {
                    '$first': '$videogames'
                },
                'user': {
                    '$first': '$user'
                }
            }
        }, {
            '$sort': {
                'winAmount': -1
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
            '$lookup': {
                'from': 'videogames',
                'localField': 'videogames',
                'foreignField': '_id',
                'as': 'videogames'
            }
        }, {
            '$project': {
                'winAmount': '$winAmount',
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

export default pipeline_biggest_user_winners_esports;