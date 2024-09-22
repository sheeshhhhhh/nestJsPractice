import { memo, useEffect, useState } from "react"
import useDebounce from "../../../../util/useDebounce";
import { Input } from "../../../ui/input";
import apiClient from "../../../../util/apiClient";
import apiErrorHandler from "../../../../util/apiErrorHandler";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "../../../ui/button";

const CurrentOrderHeader = () => {
    const [search, setSearch] = useState<string>('')
    const debounceValue = useDebounce(search, 500);
    const queryClient = useQueryClient();

    useEffect(() => {
        const searchOrder = async () => {
            const response = await apiClient.get(`restaurant/getOrders?search=${debounceValue || ''}`)
            if(response.status >= 400) {
                const message = response.data.message
                const error = response.data.error
                return apiErrorHandler({ error, message, status: response.status })
            }

            queryClient.setQueryData(['restaurantOrders'], response.data)
        }
        searchOrder()
    }, [debounceValue])

    return (
        <div className="gap-3 items-center py-3">
            <div className="flex gap-3">
                <Input 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-[400px]"
                placeholder="Search OrderId"
                />
                <Button
                onClick={() => setSearch('')}
                variant={'outline'}
                >
                    Clear search
                </Button>
            </div>
            <h2 className="text-muted-foreground">
                Only used for when receipt is already printed.
                for marking as done
            </h2>
        </div>
    )
}

export default memo(CurrentOrderHeader)