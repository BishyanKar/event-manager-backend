

let ArtistsModel = require('../../models/base/artist');

class Artist {
    constructor(payload, params=null) {
        
        this.payload = payload;
        this.params = params;    
        
    }

    async artistList() {
        try {
            let response;
            response = await ArtistsModel.find({});
            if(response) {
                return response
            } else {
                throw new CustomError('not working', 500 , 'artistList');
            }
        } catch (error) {
            throw new CustomError(error.message, 500 , 'artistList');
        }
    }

    async artistByID() {
        try {
            let id = this.params.id;
            let response = [];
            if(this.params.id) {
                response = await ArtistsModel.findOne({"_id": id})
            } else {
                throw new CustomError('No id found', 500 , 'artistList');
            }
            return response
        } catch (error) {
            throw new CustomError(error.message, 500 , 'artistList');
        }
    }
    
    async eventsPerArtist() {
        try {
            let response = await ArtistsModel.find({});
            return response
        } catch (error) {
            throw new CustomError(error.message, 500 , 'artistList');
        }
    }
}

module.exports = Artist;
