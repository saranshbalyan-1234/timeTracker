module.exports = (sequelize, DataTypes) => {
  const Tracking = sequelize.define(
    "trackings",
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        // references: "users",
        // referencesKey: "id",
        validate: {
          notNull: true,
          // len: [1, 2],
        },
      },
      date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      data: {
        type: DataTypes.TEXT,
        allowNull: false,
        // defaultValue: "saransh@email",
        // unique:true,
        validate: {
          notNull: true,
          // len: [1, 2],
        },
      },
    }
    // {
    // tableName:"name",
    // timetamps:false,
    // updatedAt:false,
    // createdAt:false,
    // createdAt:"createAt",
    // engine:"MYISAM"
    // }
  );

  // #association: hasOne,hasMany,belongsToOne,belongsToMany

  //   User.hasMany(sequelize.models.Car, {
  //     foreignKey: "user_id",
  //     as: "nameChange",
  //   });

  // #Scopes: kind of middleware

  // 1) Scope with calling association

  //   User.addScope("name", {
  //     include: [
  //       {
  //         attributes: ["name"],
  //         model: sequelize.models.Car,
  //         as: "nameChange",
  //       },
  //     ],
  //   });

  // 2) Scope with Where condition

  //   User.addScope("name", {
  //     where: { name: "saransh" },
  //   });

  return Tracking;
};
