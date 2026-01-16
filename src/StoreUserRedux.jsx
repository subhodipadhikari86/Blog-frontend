import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react';
import { getUserDetails } from './ApiCall';
export const StoreUserRedux = async () => {
    const dispatch = useDispatch();
    try {
        const userDet = await getUserDetails()
        if (userDet) {
            dispatch(storeUser(userDet));
        }
    }
    catch (e) {
        console.log(e);

    }
}