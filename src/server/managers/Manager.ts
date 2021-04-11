import { Model, Document } from "mongoose";
import { Collection, Client } from "discord.js";

export default class Manager<T, V extends Document> {
  public model: Model<V>;
  public cache = new Collection<string, any>();
  public client: Client;

  constructor(model: Model<V>, client: Client) {
    this.model = model;
    this.client = client;
  }

  public async init() {
    const items = await this.model.find();
    for (const item of items) {
      this.cache.set(item.id, item);
    }
  }

  public get(id: string) {
    return this.cache.get(id);
  }

  public async add(item: T): Promise<V> {
    try {
      const newItem = new this.model(item);
      await newItem.save();
      this.cache.set(newItem.id, item);
      return newItem;
    } catch (err) {
      throw err;
    }
  }

  public async remove(id: string): Promise<V | null> {
    try {
      const deletedItem = await this.model.findByIdAndDelete(id);
      this.cache.delete(id);
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
      this.cache.set(id, updatedItem);
      return updatedItem;
    } catch (err) {
      throw err;
    }
  }
}
