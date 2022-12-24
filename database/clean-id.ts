export const cleanId = (objects) => {
    return objects.map((object) => {
        const { id, ...data } = object;
        return data;
    });
};
