import SearchBar from "./searchBar";
import CustomDropdown from "./customDropdown";

export default function FilterDropdown({ children }: { children ?: React.ReactNode }) {
    return (
        <div className="absolute w-[320px] min-h-[300px] h-full overflow-auto">
            <CustomDropdown>
                <div className="p-[10px] pb-[6px]">
                    <SearchBar />
                </div>
                <div>
                    {children}
                </div>
            </CustomDropdown>
        </div>
    );
}
