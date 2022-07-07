'use strict';

/**
 *  nilai controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::nilai.nilai', ({strapi}) =>({
    async find(){ 
        const mark = await strapi.entityService.findMany('api::nilai.nilai', {
            populate: ['siswa', 'guru', 'matpel'],
          });
        for (let index = 0; index < mark.length; index++) {
            const student = await strapi.query('api::siswa.siswa').findOne({
                where: {nisn: mark[index].siswa[0]?.nisn}
            }
             ); 
            const teacher = await strapi.query('api::guru.guru').findOne({
                where:  {nip:  mark[index].guru[0]?.nip}
            }
             );       
                    
            const subject = await strapi.query('api::matpel.matpel').findOne({
                where:  {id_matpel:  mark[index].matpel[0]?.id_matpel}
            }
             );              
            mark[index].siswa = student?.nama_siswa;
            mark[index].nama_matpel = subject?.nama_matpel;
            mark[index].guru = teacher?.nama_guru;
            mark[index].nisn = student?.nisn;
            mark[index].matpel = subject?.id_matpel;
            mark[index].nip = teacher?.nip;

            delete mark[index].createdAt;
            delete mark[index].updatedAt;
        } 
        return(mark)

    }
    // async update(ctx){
    //     const request = ctx.request.body
    //     const { id } = ctx.params;

    //     const teacher = await strapi.query('api::guru.guru').findOne({
    //         where:  {nip:  request.data.nip}
    //     }
    //      );  
    //     const entry = await strapi.entityService.update('api::article.article', 1, {
    //         data: {
    //           title: 'xxx',
    //         },
    //       });
    // }
}));