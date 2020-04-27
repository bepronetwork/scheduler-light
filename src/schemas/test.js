import { DatabaseSingleton } from "../core/mongo";
let db = DatabaseSingleton.getConnectMain();
class TestSchema{};

TestSchema.prototype.name = "Test";

TestSchema.prototype.schema = {
    name: { type: String, required : true},
    text: { type: String, required : true}
};

TestSchema.prototype.model = db.model(TestSchema.prototype.name, new db.Schema(TestSchema.prototype.schema));

export {
    TestSchema
}
