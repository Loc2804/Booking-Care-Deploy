'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => { //chạy thêm dữ liệu, chạy bth
    return queryInterface.bulkInsert('users', [
      {
        email: 'nguyenloc02082004@gmail.com',
        password: '123456', // hash password -> bảo mật
        firstName: 'Nguyen',
        lastName: 'Loc',  
        address: 'Lac Long Quan Da Nang',
        phonenumber:'0914324759',
        gender: 1,
        roleId:'R1',
        positionId:'ADMIN',
        image:'',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => { //cancel việc thêm dữ liệu, chạy rollback
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
