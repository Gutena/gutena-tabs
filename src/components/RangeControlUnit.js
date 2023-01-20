/**
 * Range Unit control :
 * unit selection with set space attributes
 */
import { __ } from '@wordpress/i18n';
import {
    BaseControl,
    RangeControl,
    __experimentalUseCustomUnits as useCustomUnits,
    __experimentalUnitControl as UnitControl,
    __experimentalParseQuantityAndUnitFromRawValue as parseQuantityAndUnitFromRawValue,
} from '@wordpress/components';
import { gkIsEmpty } from '../utils/helpers';
 
const RangeControlUnit = ( props ) => {
    const {
        rangeLabel,
        attrValue,
        onChangeFunc,
        rangeMin,
        rangeMax,
        rangeStep,
        attrUnits = [ 'px', 'em', 'rem', 'vh', 'vw' ]
    } = props;

    const units = useCustomUnits( {
        availableUnits: attrUnits,
        defaultValues: { px: 0, em: 0, rem: 0, vh: 0, vw: 0, '%': 0 },
    } );

    const getQtyOrunit = ( rawUnit, quantityOrUnit = 'unit' ) => {
        const [ quantityToReturn, unitToReturn ] = parseQuantityAndUnitFromRawValue( rawUnit );

        let unit =
            'undefined' === typeof unitToReturn || null === unitToReturn
                ? 'px'
                : unitToReturn;

        return 'unit' === quantityOrUnit ? unit : quantityToReturn;
    };

    return (
        <BaseControl 
            label={ gkIsEmpty( rangeLabel ) ? '' : rangeLabel } 
            className="components-gutena-tabs-range-unit-control"
            >
                <div className="components-gutena-tabs-range-unit-control__wrapper">
                    <UnitControl
                        units={ units }
                        value={ attrValue }
                        onChange={ ( attrValue ) => onChangeFunc( attrValue ) }
                        className="components-spacing-sizes-control__custom-value-input"
                    /> 
                    <RangeControl
                        value={ getQtyOrunit( attrValue, 'Qty' ) }
                        withInputField={ false }
                        onChange={ ( qty ) => onChangeFunc( qty + getQtyOrunit( attrValue ) ) }
                        min={ rangeMin }
                        max={ rangeMax[ getQtyOrunit( attrValue ) ] }
                        step={ rangeStep }
                        className="components-spacing-sizes-control__custom-value-range"
                    />
                </div>
        </BaseControl>
    );
};

export default RangeControlUnit;