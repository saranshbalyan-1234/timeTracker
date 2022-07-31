module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "users",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        // defaultValue: "saransh@email",
        // unique:true,
        validate: {
          notNull: true,
          // len: [1, 2],
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
          notNull: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: true,
        },
      },

      verifiedAt: {
        type: DataTypes.DATE,
        allowNull: true,
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

  return User;
};
