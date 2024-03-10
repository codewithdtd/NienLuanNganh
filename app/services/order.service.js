const { ObjectId } = require("mongodb");
class OrderService {
    constructor(client) {
        this.Order = client.db().collection("orders");
    }
// Định nghĩa các phương thức truy xuất CSDL sử dụng mongodb API
    infoOrder(payload) {
        const order = {
            userId: payload.userId,
            name: payload.name,
            phone: payload.phone,
            address: payload.address,
            note: payload.note,
            deliveryDate: payload.deliveryDate,
            status: payload.status,
            methodPayment: payload.methodPayment,
            detail: payload.detail,
            totalPrice: payload.totalPrice
        };
        // Remove undefined fields
        Object.keys(order).forEach(
            (key) => {
                order[key] === undefined && delete order[key]
            }
        );
        return order;
    }
    async create(payload) {
        const order = this.infoOrder(payload);
        const result = await this.Order.findOneAndUpdate(
            order,
            { $set: { 
                status: "Đang chuẩn bị hàng",
                orderDay: new Date().getDate()+'/'+ (new Date().getMonth()+1)+'/'+new Date().getFullYear() + ' ' + new Date().getHours() +':' + new Date().getMinutes() + ':' + new Date().getSeconds(),
            }},
            { returnDocument: "after", upsert: true }
        );
    
        return result;
    }

    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.infoOrder(payload);
        const result = await this.Order.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result;
    }

    async find(id) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const result = await this.Order.find(filter);
        return result.toArray();
    }

    async findAllOrderUser(id) {
        const filter = {
            userId: id,
        };
        const result = await this.Order.find(filter);
        return result.toArray();
    }

    async delete(id) {
        const result = await this.Order.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }

    async deleteAll() {
        const result = await this.Order.deleteMany({});
        return result.deletedCount;
    }

}



module.exports = OrderService;