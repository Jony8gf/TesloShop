import useSWR, { SWRConfiguration } from 'swr' 
import { IProduct } from '../interfaces';

// const fetcher = (...args: [key: string]) => fetch(...args).then(res => res.json())

// const { data, error } = useSWR('/api/products', fetcher, {
  //   refreshInterval: 5000
  // })

export const useProducts = (url: string, config: SWRConfiguration = {}) => {
    console.log(`/api${url}`);
    const { data, error } = useSWR<IProduct[]>(`/api${url}`, config);
    // const { data, error } = useSWR<IProduct[]>(`/api${url}`, fetcher, config);
    return {
        products: data,
        isLoading: !error && !data,
        isError: error
    }
}