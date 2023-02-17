import { BlockPartInput, BlockType, BlockInput, BlockInstance, BlockDropdownOption, BlockDropdownProvider, BlockPartInputDropdown, ScuffrBlockReference, ScuffrElementBlockContent, ScuffrElementBlockInstance, ScuffrElementInput } from "scuff";

export interface ScratchDropdownOptionRenderer {
    renderOption(option: BlockDropdownOption, parent: ScuffrElementBlockInstance, parentRef: ScuffrBlockReference<BlockPartInput, ScuffrElementBlockContent>): ScuffrElementInput;
}

export type ScratchDropdownOptionShorthand = [id: string, text: string];

export interface ScratchDropdownOptionProvider {
    getOptions(provider: BlockDropdownProvider, block: BlockInstance): BlockDropdownOption[];
}

export abstract class ScratchInputTypeDropdown<T extends BlockInput> extends BlockPartInputDropdown<T> {

    public constructor(id: string, block: BlockType, optionRenderer: ScratchDropdownOptionRenderer, scratchOptionProvider: ScratchDropdownOptionProvider | ScratchDropdownOptionShorthand[]) {
        let optionProvider: BlockDropdownProvider;

        if (Array.isArray(scratchOptionProvider)) {
            const scratchOptions: ScratchDropdownOptionShorthand[] = scratchOptionProvider;
            const optionConverter: BlockDropdownProvider & { _convertedOptions: BlockDropdownOption[] | null } = {
                ...optionRenderer,
                _convertedOptions: null,
                getOptions() {
                    if (this._convertedOptions) return this._convertedOptions;
                    this._convertedOptions = [];
                    for (const scratchOption of scratchOptions)
                        this._convertedOptions.push(new BlockDropdownOption(optionProvider, scratchOption[0], scratchOption[1]));
                    return this._convertedOptions;
                }
            };
            optionProvider = optionConverter;
        } else {
            optionProvider = {
                ...optionRenderer,
                getOptions(block: BlockInstance) {
                    return scratchOptionProvider.getOptions(this, block);
                }
            };
        }
        super(id, block, optionProvider);
    }
}
