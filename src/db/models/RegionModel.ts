import * as Sequelize from "sequelize";
import { db } from "../db";

interface RegionModelAttributes {
  id: number;
  region: string;
}

type RegionModelCreationAttributes = Omit<RegionModelAttributes, "id">;

export type RegionModelViewAttributes = RegionModelAttributes;

interface RegionModelInstance
  extends Sequelize.Model<RegionModelAttributes, RegionModelCreationAttributes>,
    RegionModelAttributes {}

export const RegionModel = db.define<RegionModelInstance>("region", {
  id: {
    type: Sequelize.UUID,
    autoIncrement: true,
    primaryKey: true,
  },
  region: Sequelize.STRING,
});
