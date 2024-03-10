const { ObjectId } = require("mongodb");
class CategoryService {
    constructor(client) {
        this.Category = client.db().collection("categorys");
    }
// Định nghĩa các phương thức truy xuất CSDL sử dụng mongodb API
    infoCategory(payload) {
        const category = {
            name: payload.name,
        };
        // Remove undefined fields
        Object.keys(category).forEach(
            (key) => {
                category[key] === undefined && delete category[key]
            }
        );
        return category;
    }
    async create(payload) {
        const category = this.infoCategory(payload);
        const result = await this.Category.findOneAndUpdate(
            category,
            { $set: {}},
            { returnDocument: "after", upsert: true }
        );
        return result;
    }

    async find(filter) {
        const cursor = await this.Category.find(filter);
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
        return await this.Category.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.infoCategory(payload);
        const result = await this.Category.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "before" }
        );
        return result;
    }

    async delete(id) {

        const result = await this.Category.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
       
        return result;
    }

    async deleteAll() {
        const result = await this.Category.deleteMany({});
        return result.deletedCount;
    }
}



module.exports = CategoryService;
