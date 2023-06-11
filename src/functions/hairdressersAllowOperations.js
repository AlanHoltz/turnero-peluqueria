const hairdressersAllowOperations = (me, user) => {



    return {
        edit: me.privilege < user.privilege || me.id === user.id,
        delete: me.privilege < user.privilege
    }



};

export { hairdressersAllowOperations };