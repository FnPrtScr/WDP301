const { Role,sequelize } = require('../models')
const moment = require("moment");
const importDataExcel = require('../imports/import-data-excel');
const { ErrorResponse } = require('../utils/response');
class RolesService {
    async getOne(req, res) {
        return res.status(200).send('abcd');
    }
    async createOne(req,res){
        const {name}=req.body;
        try {
            const result=await Role.create({name:name});
            return res.status(200).send(result);
        } catch (error) {
            throw new Error(error.message);
        }
    }
    async importRoles(req,res,next){
        try {
            const datas=await importDataExcel.fncImportDataTypeXLSXhaveHeader(req, res, next);
            const allRole=[];
            datas.map((data)=>{
                const role={
                    name:data.Name
                }
                allRole.push(role);
            })
            const result = await Role.bulkCreate(allRole);
            
            return res.status(200).send(result);
        } catch (error) {
            throw new Error(error.message);
        }
    }



}
module.exports = new RolesService();