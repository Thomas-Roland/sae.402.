const { Sequelize, DataTypes } = require("sequelize");

const myDB = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || "sqlite",
    storage: process.env.DB_STORAGE || "./database.sqlite",
    port: process.env.DB_PORT || 3306,
    logging: console.log,
  }
);







const Actor = myDB.define(
  "Actor",
  {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    name: { 
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false, 
  }
);






const Movie = myDB.define(
  "Movie",
  {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false, 
  }
);







const MoviesActors = myDB.define(
  "MoviesActors",
  {
    id_movie: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    id_actor: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
  },
  {
    timestamps: false, 
  }
);







Movie.hasMany(MoviesActors, { foreignKey: "id_movie" });
MoviesActors.belongsTo(Movie, { foreignKey: "id_movie" });

Actor.hasMany(MoviesActors, { foreignKey: "id_actor" });
MoviesActors.belongsTo(Actor, { foreignKey: "id_actor" });



module.exports = {
  myDB,
  Actor,
  Movie,
  MoviesActors
};