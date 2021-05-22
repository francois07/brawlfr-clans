import type { Model, Document } from "mongoose";
import { EventEmitter } from "events";

export default class Manager<T, V extends Document> extends EventEmitter {
  public model: Model<V>;
  public emitter: EventEmitter = new EventEmitter();

  constructor(model: Model<V>, validator?: any) {
    super();
    this.model = model;
  }

  public async get(id: string) {
    return this.model.findById(id);
  }

  public async add(item: T): Promise<V> {
    try {
      const newItem = new this.model(item);
      await newItem.save();
      this.emit("addItem", newItem);
      return newItem;
    } catch (err) {
      throw err;
    }
  }

  public async remove(id: string): Promise<V | null> {
    try {
      const deletedItem = await this.model.findByIdAndDelete(id);
      this.emit("deleteItem", deletedItem);
      return deletedItem;
    } catch (err) {
      throw err;
    }
  }

  public async update(id: string, item: any): Promise<V | null> {
    try {
      const updatedItem = await this.model.findByIdAndUpdate(id, item, {
        new: true,
      });
      this.emit("updateItem", updatedItem);
      return updatedItem;
    } catch (err) {
      throw err;
    }
  }
}
