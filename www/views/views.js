import { apiRequest, authenticatedRequest} from "../conf/api.js";
import { redirect } from "../conf/render.js";
import { data } from "../conf/state.js";

export async function useSqlite(){
    document.addEventListener('click', async (event) => {
        const sqlitebtn = event.target.closest('#useSqlite');
        if (!sqlitebtn) return;
        event.preventDefault();

        try{
            redirect('/about', data);
        }catch(error){
            data.data = {message: error.message || 'Не удалось загрузить'};
            console.error('about', error);
        }

    });
}

