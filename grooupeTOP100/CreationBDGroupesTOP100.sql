CREATE DATABASE GroupesTOP100;
USE GroupesTOP100;

CREATE TABLE Personne(
   per_id CHAR(36),
   per_nom CHAR(100),
   PRIMARY KEY(per_id)
);

CREATE TABLE Groupe(
   grp_id CHAR(36),
   grp_nom VARCHAR(50),
   grp_pays VARCHAR(50),
   grp_naissance YEAR,
   genre VARCHAR(50),
   PRIMARY KEY(grp_id)
);

CREATE TABLE Piste(
   pst_id CHAR(36),
   pst_titre VARCHAR(50),
   duree INT,
   PRIMARY KEY(pst_id)
);

CREATE TABLE Album(
   alb_id CHAR(36),
   alb_titre VARCHAR(50),
   format VARCHAR(50),
   sortie DATE,
   alb_pays CHAR(2),
   PRIMARY KEY(alb_id)
);

CREATE TABLE participe(
   per_id CHAR(36),
   pst_id CHAR(36),
   role VARCHAR(50),
   PRIMARY KEY(per_id, pst_id, role),
   FOREIGN KEY(per_id) REFERENCES Personne(per_id),
   FOREIGN KEY(pst_id) REFERENCES Piste(pst_id)
);

CREATE TABLE constitue(
   pst_id CHAR(36),
   alb_id CHAR(36),
   numero VARCHAR(3),
   PRIMARY KEY(pst_id, alb_id, numero),
   FOREIGN KEY(pst_id) REFERENCES Piste(pst_id),
   FOREIGN KEY(alb_id) REFERENCES Album(alb_id)
);

CREATE TABLE enregistre(
   grp_id CHAR(36),
   pst_id CHAR(36),
   PRIMARY KEY(grp_id, pst_id),
   FOREIGN KEY(grp_id) REFERENCES Groupe(grp_id),
   FOREIGN KEY(pst_id) REFERENCES Piste(pst_id)
);
