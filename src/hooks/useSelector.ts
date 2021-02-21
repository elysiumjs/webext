import { IRootState } from "../store";
import { useSelector as useReactReduxSelector } from "react-redux";

export function useSelector<T>(fn: (state: IRootState) => T) {
    return useReactReduxSelector(fn);
}
