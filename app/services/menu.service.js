const { ObjectId } = require("mongodb");
class MenuService {
    constructor(client) {
        this.Menu = client.db().collection("menus");
    }
// Định nghĩa các phương thức truy xuất CSDL sử dụng mongodb API
    infoMenu(payload) {
        const menu = {
            name: payload.name,
            price: payload.price,
            category: payload.category,
            discount: payload.discount,
            thumbnail: payload.thumbnail,
            status: payload.status,
            quanlity: payload.quanlity,
            description: payload.description,
            created_at: payload.created,
            updated_at: payload.updated,
            deleted: 0,
        };
        // Remove undefined fields
        Object.keys(menu).forEach(
            (key) => {
                menu[key] === undefined && delete menu[key]
            }
        );
        return menu;
    }
    async create(payload) {
        const menu = this.infoMenu(payload);
        const result = await this.Menu.findOneAndUpdate(
            menu,
            { $set: {created_at: new Date().getDate()+'/'+ (new Date().getMonth()+1)+'/'+new Date().getFullYear()}},
            { returnDocument: "after", upsert: true }
        );
        return result;
    }

    async find(filter) {
        // const filter = {};
        const cursor = await this.Menu.find(filter);
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
        const result = await this.Menu.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });

        return result.toArray();
    }

    async findByCategoryName(name) {
        const result = await this.Menu.find({
            category: name,
        });
        return result.toArray();

    }


    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.infoMenu(payload);
        update.updated_at = new Date().getDate()+'/'+ (new Date().getMonth()+1)+'/'+new Date().getFullYear();
        const result = await this.Menu.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result;
    }
    
    async updateProductCategory(name, payload) {
        // const update = this.infoMenu(payload);
        // update.updated_at = new Date().getDate()+'/'+ (new Date().getMonth()+1)+'/'+new Date().getFullYear();
        const result = await this.Menu.findOneAndUpdate(
            {category: name},
            { $set: {category: payload.name}},
            { returnDocument: "after" }
        );
        return result;
    }

    async delete(id) {
        const result = await this.Menu.findOneAndUpdate({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        },
        {$set: {"deleted": 1}},
        { returnDocument: "after" });
        return result;
    }

    async deleteAll() {
        const result = await this.Menu.deleteMany({});
        return result.deletedCount;
    }
}



module.exports = MenuService;
