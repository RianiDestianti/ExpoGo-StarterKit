type SetState<State> = React.Dispatch<React.SetStateAction<State>>;

// Versi React Native dari handleChangeInput: TextInput memberi value lewat onChangeText, bukan event.
export const handleChangeInput = <State extends Record<string, any>>(
    name: keyof State,
    value: string,
    setValue: SetState<State>
) => {
    setValue(prevState => ({
        ...prevState,
        [name]: value
    }));
};

export const firstError = (errorFields: Record<string, string[]> | null, field: string): string | null => {
    return errorFields?.[field]?.[0] ?? null
}
