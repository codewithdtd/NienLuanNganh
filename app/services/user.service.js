const { ObjectId } = require("mongodb");
class UserService {
    constructor(client) {
        this.User = client.db().collection("users");
    }
// Định nghĩa các phương thức truy xuất CSDL sử dụng mongodb API
    infoUser(payload) {
        const user = {
            name: payload.name,
            address: payload.address,
            email: payload.email,
            phone: payload.phone,
            password: payload.password,
            roleID: 0,
            created_at: payload.created,
            updated_at: payload.updated,
            deleted: 0,
        };
        // Remove undefined fields
        Object.keys(user).forEach(
            (key) => {
                user['roleID'] = 0;
                user[key] === undefined && delete user[key]
            }
        );
        return user;
    }
    async create(payload) {
        const user = this.infoUser(payload);
        const result = await this.User.findOneAndUpdate(
            user,
            { $set: {created_at: new Date().getDate()+'/'+ (new Date().getMonth()+1)+'/'+new Date().getFullYear()}},
            { returnDocument: "after", upsert: true }
        );
        return result;
    }

    async find(filter) {
        const cursor = await this.User.find(filter);
        return await cursor.toArray();
    }

    async findByQuery(query) {
        const filter = {};
        for (const key in query) {
            if (Object.hasOwnProperty.call(query, key)) {
                filter[key] = { $regex: new RegExp(query[key], 'i') };
            }
        }
        return await this.find(filter);
    }

    async findById(id) {
        return await this.User.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.infoUser(payload);
        const result = await this.User.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result;
    }

    async delete(id) {
        const result = await this.User.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }

    async deleteAll() {
        const result = await this.User.deleteMany({});
        return result.deletedCount;
    }
}



module.exports = UserService;