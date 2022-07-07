'use strict';

/**
 *  guru controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::guru.guru', ({strapi}) =>({
    async create(ctx) {
        const request = ctx.request.body;

        // const subject = await strapi.query('api::matpel.matpel').findOne({
        // where: {id_matpel:request.data.matpel}
        //     }); 
        // request.data.matpel = subject.id;
        
        
        const postTeacher = await strapi.query('api::guru.guru').create({...request});
        const teacher = await strapi.query('api::guru.guru').findOne({
            where:  {nip: request.data.nip}
           }); 
           request.data.nip = teacher.id; 

        
        const mark = await strapi.entityService.findMany('api::nilai.nilai', {
            populate: ['matpel'],
          });
        const filteredMark = mark.filter((mark)=> mark.matpel[0].id == request.data.matpel)
          console.log(filteredMark)
        for (let index = 0; index < filteredMark.length; index++) {
            await strapi.entityService.update('api::nilai.nilai', filteredMark[index].id, {
                data: {
                  guru: request.data.nip,
                },
              });
        }
        console.log(request)
        return postTeacher;
    },
    async findOne(ctx){
        const { id } = ctx.params;

        const mark = await strapi.entityService.findMany('api::nilai.nilai', {
            populate: ['guru', 'matpel'],
          });
        const filteredMark = mark.filter((mark)=> mark.guru[0]?.nip == id);
        return filteredMark 
    },
    async delete(ctx){
      const { id } = ctx.params;
      const mark = await strapi.entityService.findMany('api::nilai.nilai', {
        populate: ['guru'],
      });
      const filteredMark = mark.filter((mark)=> mark.guru[0]?.id == id);
      
      for (let index = 0; index < filteredMark.length; index++) {
        await strapi.entityService.update('api::nilai.nilai', filteredMark[index].id, {
            data: {
              guru: null,
            },
          });
        
      const deleteTeacher = await strapi.entityService.delete('api::guru.guru', id);
      return deleteTeacher
    }
    },
    async find(){
      const teacher = await strapi.entityService.findMany('api::guru.guru', {
        populate: ['matpel'],
      });
      return teacher
    }
}));
