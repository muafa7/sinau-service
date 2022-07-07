'use strict';

/**
 *  siswa controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::siswa.siswa', ({strapi}) =>({
    async create(ctx) {
        const request = ctx.request.body
        const getIdSubject = await strapi.query('api::matpel.matpel').findMany({
            select: ['id'],
        }
         );
        const arrayId = getIdSubject.map(subject => subject.id);
        request.data.matpel = arrayId;

        const postStudent = await strapi.query('api::siswa.siswa').create({...request});
        
        const student = await strapi.query('api::siswa.siswa').findOne({
            where: { nisn: request.data.nisn },
        }
         ); 

        for (let index = 0; index < arrayId.length; index++) {
            await strapi.query('api::nilai.nilai').create({
                data: {
                    matpel : arrayId[index],
                    siswa: student.id
                }});
        }
        return postStudent;
    },
    async findOne(ctx){
        const { id } = ctx.params;

        const mark = await strapi.entityService.findMany('api::nilai.nilai', {
            populate: ['siswa', 'matpel'],
          });
        const filteredMark = mark.filter((mark)=> mark.siswa[0].nisn == id);
        return filteredMark 
    },
    async delete(ctx){
      const { id } = ctx.params;
      const mark = await strapi.entityService.findMany('api::nilai.nilai', {
        populate: ['siswa'],
      });
      const filteredMark = mark.filter((mark)=> mark.siswa[0]?.id == id);
      
      for (let index = 0; index < filteredMark.length; index++) {
        await strapi.entityService.delete('api::nilai.nilai', filteredMark[index].id);
        
    }
    const deleteStudent = await strapi.entityService.delete('api::siswa.siswa', id);
    return deleteStudent
    }
}));
