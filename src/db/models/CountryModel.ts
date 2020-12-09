import * as Sequelize from "sequelize";
import { db } from "../db";

interface CountryModelAttributes {
  id: number;
  country: string;
}

type CountryModelCreationAttributes = Omit<CountryModelAttributes, "id">;

export type CountryModelViewAttributes = CountryModelAttributes;

interface CountryModelInstance
  extends Sequelize.Model<CountryModelAttributes, CountryModelCreationAttributes>,
    CountryModelAttributes {}

export const CountryModel = db.define<CountryModelInstance>("country", {
  id: {
    type: Sequelize.UUID,
    autoIncrement: true,
    primaryKey: true,
  },
  country: Sequelize.STRING,
});
