const { QueryTypes } = require("sequelize");
const { Op } = require("sequelize");
const sequelize = require("../util/database");
const Racun = require("../models/Racun");
const Period = require("../models/Period");
const Placanje = require("../models/Placanje");
const Poverilac = require("../models/Poverilac");

exports.getGodine = (req, res) => {
  async function distGodine() {
    const sql =
      "SELECT distinct periodGodina as godina from racuni.periodi order by periodGodina desc";

    const godine = await sequelize.query(sql, {
      type: QueryTypes.SELECT,
    });

    return godine;
  }

  distGodine()
    .then((godine) => {
      res.json(godine);
    })
    .catch((e) => console.log(e));
};

exports.postAddPoverilac = (req, res) => {
  const poverilacNaziv = req.body.poverilacNaziv;
  const poverilacKrace = req.body.poverilacKrace;
  const modelPlacanja = req.body.modelPlacanja;
  const tekRacun = req.body.tekRacun;
  const userId = req.body.userId;

  Poverilac.findOne({
    where: {
      [Op.and]: [{ userId }, { poverilacKrace }, { tekRacun }],
    },
  })
    .then((found) => {
      if (found) {
        return res.json({
          status: 400,
          message: "Poverilac već postoji",
        });
      } else {
        Poverilac.create({
          poverilacNaziv,
          poverilacKrace,
          modelPlacanja,
          tekRacun,
          userId,
        })
          .then((created) => {
            res.json({
              status: 201,
              message: `Poverilac ${created.poverilacKrace} uspešno kreiran`,
            });
          })
          .catch((e) => console.log(e));
      }
    })
    .catch((e) => console.log(e));
};

exports.editPoverilac = (req, res) => {
  const poverilacId = req.body.poverilacId;
  const poverilacKrace = req.body.poverilacKrace;
  const poverilacNaziv = req.body.poverilacNaziv;
  const tekRacun = req.body.tekRacun;
  const modelPlacanja = req.body.modelPlacanja;

  Poverilac.update(
    {
      poverilacKrace,
      poverilacNaziv,
      tekRacun,
      modelPlacanja,
    },
    {
      where: {
        poverilacId,
      },
    }
  ).then((updated) => {
    res.json({
      status: 201,
      message: "Poverilac izmenjen!",
    });
  });
};

exports.getPoverioci = (req, res) => {
  const userId = req.params.userId;
  Poverilac.findAll({
    where: {
      userId: userId,
    },
    order: [["poverilacKrace", "ASC"]],
  })
    .then((poverioci) => {
      res.json(poverioci);
    })
    .catch((e) => console.log(e));
};

exports.getPeriodi = (req, res) => {
  Period.findAll()
    .then((periodi) => {
      res.json(periodi);
    })
    .catch((e) => console.log(e));
};

exports.postAddBill = (req, res) => {
  const pozivNaBroj = req.body.pozivNaBroj;
  const iznosRacuna = parseFloat(req.body.iznosRacuna);
  const poverilacId = parseInt(req.body.poverilacId);
  const periodId = parseInt(req.body.periodId);
  const userId = parseInt(req.body.userId);

  Racun.findOne({
    where: {
      [Op.and]: [{ userId }, { poverilacId }, { periodId }],
    },
  })
    .then((found) => {
      if (found) {
        return res.json({
          status: 400,
          message: "Račun već postoji!",
        });
      }
      Racun.create({
        pozivNaBroj,
        iznosRacuna,
        poverilacId,
        periodId,
        userId,
      }).then((created) => {
        res.json({
          status: 201,
          message: "Uspešno dodat račun",
        });
      });
    })
    .catch((e) => console.log(e));
};

exports.getRacuni = (req, res) => {
  const userId = req.params.userId;
  async function racuni() {
    const sql = `SELECT racuni.racunId, racuni.userId, poverioci.poverilacId, poverioci.poverilacKrace, poverioci.poverilacNaziv, poverioci.tekRacun,
     poverioci.modelPlacanja, periodi.periodMesec, periodi.periodGodina, periodi.periodId, racuni.iznosRacuna, racuni.pozivNaBroj,
     Sum(IFNULL(placanja.iznosPlacanja, 0)) AS SumOfIznosPlacanja,
    (Round(COALESCE(iznosRacuna,0),2)-Round(COALESCE(Sum(placanja.iznosPlacanja),0),2)) AS razlika, 
    (CASE 
    WHEN (Round(COALESCE(iznosRacuna,0),2)-Round(COALESCE(Sum(placanja.iznosPlacanja),0),2))=0 THEN "plaćeno"
    WHEN (Round(COALESCE(iznosRacuna,0),2)-Round(COALESCE(Sum(placanja.iznosPlacanja),0),2))>0 And
    (Round(COALESCE(iznosRacuna,0),2)-Round(COALESCE(Sum(placanja.iznosPlacanja),0),2))<Round(COALESCE(iznosRacuna,0),2) THEN "delimično plaćeno"
    WHEN Round(COALESCE(Sum(placanja.iznosPlacanja),0),2)=0 THEN "neplaćeno"
    END) AS statusPlacanja
    FROM periodi INNER JOIN (poverioci INNER JOIN (racuni LEFT JOIN placanja ON racuni.RacunId = placanja.racunId) ON
    poverioci.poverilacId = racuni.poverilacId) ON periodi.periodId = racuni.periodId
    WHERE racuni.userId=${userId}
    GROUP BY racuni.racunId, racuni.poverilacId, racuni.periodId, racuni.iznosRacuna
    ORDER BY racuni.periodId DESC, poverioci.poverilacKrace`;

    // const sql = 0`SELECT racuni.racunId, racuni.poverilacId, racuni.periodId, periodi.periodMesec, periodi.periodGodina, poverioci.poverilacNaziv, poverioci.poverilacKrace, racuni.iznosRacuna, racuni.pozivNaBroj, poverioci.tekRacun, poverioci.modelPlacanja, racuni.userId FROM poverioci INNER JOIN (periodi INNER JOIN racuni ON periodi.periodId = racuni.periodId) ON poverioci.poverilacId = racuni.poverilacId WHERE racuni.userId=${userId} ORDER BY racuni.periodId DESC;`;

    const racuni = await sequelize.query(sql, {
      type: QueryTypes.SELECT,
    });
    return racuni;
  }

  racuni()
    .then((racuni) => {
      res.json(racuni);
    })
    .catch((e) => console.log(e));
};

exports.deleteBill = (req, res) => {
  const racunId = req.params.racunId;

  Racun.destroy({
    where: {
      racunId: racunId,
    },
  })
    .then((destroyed) => {
      res.json({
        status: 200,
        message: "Uspešno obrisan račun",
      });
    })
    .catch((e) => console.log(e));
};

exports.deleteCreditor = (req, res) => {
  const poverilacId = req.body.poverilacId;

  Poverilac.destroy({
    where: {
      poverilacId: poverilacId,
    },
  })
    .then((destroyed) => {
      res.json({
        status: 200,
        message: "Poverilac uspešno obrisan",
      });
    })
    .catch((e) => console.log(e));
};

exports.editBill = (req, res) => {
  const poverilacId = req.body.poverilacId;
  const iznosRacuna = parseFloat(req.body.iznosRacuna);
  const pozivNaBroj = req.body.pozivNaBroj;
  const racunId = req.body.racunId;
  const periodId = req.body.periodId;

  Racun.update(
    {
      poverilacId,
      iznosRacuna,
      pozivNaBroj,
      periodId,
    },
    {
      where: {
        racunId,
      },
    }
  ).then((updated) => {
    res.json({
      status: 201,
      message: "Račun izmenjen!",
    });
  });
};
exports.postAddPayment = (req, res) => {
  const userId = req.body.userId;
  const racunId = req.body.racunId;
  const datumPlacanja = req.body.datumPlacanja;
  const iznosPlacanja = req.body.iznosPlacanja;

  Placanje.create({
    userId,
    racunId,
    datumPlacanja,
    iznosPlacanja,
  })
    .then((payed) => {
      res.json({
        status: 201,
        message: "Plaćanje je evidentirano",
      });
    })
    .catch((e) => console.log(e));
};

exports.getPlacanja = (req, res) => {
  Placanje.findAll({
    order: [["datumPlacanja", "DESC"]],
  })
    .then((placanja) => {
      res.json(placanja);
    })
    .catch((e) => console.log(e));
};

exports.deletePayment = (req, res) => {
  const placanjeId = req.body.placanjeId;

  Placanje.destroy({
    where: {
      placanjeId: placanjeId,
    },
  })
    .then((destroyed) => {
      res.json({
        status: 200,
        message: "Plaćanje uspešno obrisano",
      });
    })
    .catch((e) => console.log(e));
};

exports.editPayment = (req, res) => {
  const placanjeId = req.body.placanjeId;
  const iznosPlacanja = parseFloat(req.body.iznosPlacanja);
  const datumPlacanja = req.body.datumPlacanja;
  console.log(placanjeId, iznosPlacanja, datumPlacanja);

  Placanje.update(
    {
      iznosPlacanja,
      datumPlacanja,
    },
    {
      where: {
        placanjeId,
      },
    }
  )
    .then((updated) => {
      res.json({
        status: 201,
        message: "Plaćanje izmenjeno!",
      });
    })
    .catch((e) => console.log(e));
};

exports.getGraf1 = (req, res) => {
  const userId = req.params.userId;
  async function graf1() {
    const sql = `SELECT periodi.periodGodina, poverioci.poverilacKrace, Sum(racuni.iznosRacuna) AS iznos
                FROM poverioci INNER JOIN (periodi INNER JOIN racuni ON periodi.periodId = racuni.periodId) ON poverioci.poverilacId = racuni.poverilacId
                WHERE racuni.userId=${userId}
                GROUP BY poverioci.poverilacKrace, periodi.periodGodina
                ORDER BY poverioci.poverilacKrace, periodi.periodGodina`;

    const graf1 = await sequelize.query(sql, {
      type: QueryTypes.SELECT,
    });
    return graf1;
  }

  graf1()
    .then((podaci) => {
      res.json(podaci);
    })
    .catch((e) => console.log(e));
};

exports.getGraf12 = (req, res) => {
  const userId = req.params.userId;
  async function graf12() {
    const sql = `SELECT periodi.periodGodina, Sum(racuni.iznosRacuna) AS iznos
                FROM poverioci INNER JOIN (periodi INNER JOIN racuni ON periodi.periodId = racuni.periodId) ON poverioci.poverilacId = racuni.poverilacId
                WHERE racuni.userId=${userId}
                GROUP BY periodi.periodGodina
                ORDER BY periodi.periodGodina`;

    const graf12 = await sequelize.query(sql, {
      type: QueryTypes.SELECT,
    });
    return graf12;
  }

  graf12()
    .then((podaci) => {
      res.json(podaci);
    })
    .catch((e) => console.log(e));
};

exports.getGraf2 = (req, res) => {
  const userId = req.params.userId;
  async function graf2() {
    const sql = `SELECT periodi.periodMesec, poverioci.poverilacKrace, Sum(racuni.iznosRacuna) AS iznos
                FROM poverioci INNER JOIN (periodi INNER JOIN racuni ON periodi.periodId = racuni.periodId) ON poverioci.poverilacId = racuni.poverilacId
                WHERE racuni.userId=${userId}
                GROUP BY poverioci.poverilacKrace, periodi.periodMesec
                ORDER BY periodi.periodId`;

    const graf2 = await sequelize.query(sql, {
      type: QueryTypes.SELECT,
    });
    return graf2;
  }

  graf2()
    .then((podaci) => {
      res.json(podaci);
    })
    .catch((e) => console.log(e));
};

exports.getGraf22 = (req, res) => {
  const userId = req.params.userId;
  async function graf22() {
    const sql = `SELECT periodi.periodMesec, Sum(racuni.iznosRacuna) AS iznos
                FROM poverioci INNER JOIN (periodi INNER JOIN racuni ON periodi.periodId = racuni.periodId) ON poverioci.poverilacId = racuni.poverilacId
                WHERE racuni.userId=${userId}
                GROUP BY periodi.periodMesec
                ORDER BY periodi.periodId`;

    const graf22 = await sequelize.query(sql, {
      type: QueryTypes.SELECT,
    });
    return graf22;
  }
  graf22()
    .then((podaci) => {
      res.json(podaci);
    })
    .catch((e) => console.log(e));
};

exports.getGraf31 = (req, res) => {
  const userId = req.params.userId;
  async function graf31() {
    const sql = `SELECT poverioci.poverilacKrace, Sum(racuni.iznosRacuna) AS iznos
                FROM poverioci LEFT JOIN (periodi INNER JOIN racuni ON periodi.periodId = racuni.periodId) ON poverioci.poverilacId = racuni.poverilacId
                WHERE racuni.userId=${userId}
                GROUP BY poverioci.poverilacKrace
                ORDER BY poverioci.poverilacKrace`;

    const graf31 = await sequelize.query(sql, {
      type: QueryTypes.SELECT,
    });
    return graf31;
  }

  graf31()
    .then((podaci) => {
      res.json(podaci);
    })
    .catch((e) => console.log(e));
};

exports.getGraf32 = (req, res) => {
  const userId = req.params.userId;
  async function graf32() {
    const sql = `SELECT poverioci.poverilacKrace, periodi.periodMesec, Sum(racuni.iznosRacuna) AS iznos
                FROM poverioci LEFT JOIN (periodi INNER JOIN racuni ON periodi.periodId = racuni.periodId) ON poverioci.poverilacId = racuni.poverilacId
                WHERE racuni.userId=${userId}
                GROUP BY poverioci.poverilacKrace, periodi.periodMesec
                order by poverioci.poverilacKrace`;

    const graf32 = await sequelize.query(sql, {
      type: QueryTypes.SELECT,
    });
    return graf32;
  }

  graf32()
    .then((podaci) => {
      res.json(podaci);
    })
    .catch((e) => console.log(e));
};

exports.getGraf33 = (req, res) => {
  const userId = req.params.userId;
  async function graf33() {
    const sql = `SELECT poverioci.poverilacKrace, periodi.periodGodina, Sum(racuni.iznosRacuna) AS iznos
                FROM poverioci LEFT JOIN (periodi INNER JOIN racuni ON periodi.periodId = racuni.periodId) ON poverioci.poverilacId = racuni.poverilacId
                WHERE racuni.userId=${userId}
                GROUP BY poverioci.poverilacKrace, periodi.periodGodina
                order by poverioci.poverilacKrace`;

    const graf33 = await sequelize.query(sql, {
      type: QueryTypes.SELECT,
    });
    return graf33;
  }

  graf33()
    .then((podaci) => {
      res.json(podaci);
    })
    .catch((e) => console.log(e));
};

exports.getGraf34 = (req, res) => {
  const userId = req.params.userId;
  async function graf34() {
    const sql = `SELECT poverioci.poverilacKrace, periodi.periodId, Sum(racuni.iznosRacuna) AS iznos
                FROM poverioci INNER JOIN (periodi INNER JOIN racuni ON periodi.periodId = racuni.periodId) ON poverioci.poverilacId = racuni.poverilacId
                WHERE racuni.userId=${userId}
                GROUP BY poverioci.poverilacKrace,periodi.periodId
                order by poverioci.poverilacKrace`;

    const graf34 = await sequelize.query(sql, {
      type: QueryTypes.SELECT,
    });
    return graf34;
  }

  graf34()
    .then((podaci) => {
      res.json(podaci);
    })
    .catch((e) => console.log(e));
};
