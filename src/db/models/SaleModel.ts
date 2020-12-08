interface SaleModelAttributes {
  id: string;
  regionId: string;
  countryId: string;
  itemType: string;
  salesChannel: string;
  orderPriority: string;
  orderDate: string;
  orderId: number;
  shipDate: string;
  unitsSold: number;
  unitPrice: number;
  unitCost: number;
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
}

// type ToastModelCreationAttributes = Omit<ToastModalAttributes, "id" | "userId">;

// export type ToastModelViewAttributes = Omit<ToastModalAttributes, "userId">;

// interface ToastModelInstance
//   extends Sequelize.Model<ToastModalAttributes, ToastModelCreationAttributes>,
//     ToastModalAttributes {
//   user?: UserModelViewAttributes;
// }

// export const ToastModel = db.define<ToastModelInstance>("toast", {
//   id: {
//     type: Sequelize.UUID,
//     autoIncrement: true,
//     primaryKey: true,
//   },
//   userId: {
//     type: Sequelize.UUID,
//     field: "user_id",
//     references: {
//       key: "id",
//       model: UserModel,
//     },
//   },
//   title: {
//     type: Sequelize.STRING,
//     field: "title",
//   },
//   description: {
//     type: Sequelize.STRING,
//     field: "description",
//   },
// });

// ToastModel.belongsTo(UserModel, { foreignKey: "userId" });

// export type ToastModelViewAttributesWithUser = ToastModelViewAttributes & {
//   user: UserModelViewAttributes[];
// };
