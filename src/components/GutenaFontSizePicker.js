/**
 * Gutena Responsive Font Size Picker
 */
import { __ } from '@wordpress/i18n';
import {
    FontSizePicker,
    useSetting,
} from '@wordpress/block-editor';
import {
    SelectControl,
    __experimentalUnitControl as UnitControl,
    __experimentalHStack as HStack,
    FlexItem,
    TextControl,
    Button,
    Icon,
    __experimentalText as Text,
} from '@wordpress/components';
import { useSelect } from "@wordpress/data";
import { settings } from '@wordpress/icons';
import { useState, useEffect } from '@wordpress/element';
import SelectDeviceDropdown from './SelectDeviceDropdown';
import { gkIsEmpty, getMatchArrObjKeyValue } from '../utils/helpers';
 
const noop = () => {};
 
const GutenaFontSizePicker = ( props ) => {
    const {
        label = __( 'Size', 'gutena-tabs' ),
        fontSize = undefined,
        onChangeFunc = noop,
        reponsive=false,
        setCustom=false
    } = props;
    
    //setFontAttr : if theme font selected

    //Get Device preview type
    const deviceType = useSelect( select => {
        return select( "core/edit-post" ).__experimentalGetPreviewDeviceType();
    }, [] );

    //Variable to check if typography use custom font size or not
    const [ customSize, setCustomSize ] = useState( setCustom || ( ! gkIsEmpty( fontSize ) && 10 > fontSize.length ) );
 
    //Theme font size preset
    const fontSizes = useSetting( 'typography.fontSizes' );

    //Font size array for select
    const fonSizesArray = gkIsEmpty( fontSizes ) ? [] : fontSizes.map( ( item ) => ( { label: item.name, value: 'has-'+item.slug+'-font-size', fontSize:item.size } ));
    
    //when switch theme font size to custom
    const setCustomFontSize = () => {
        if ( gkIsEmpty( fontSize ) ) {
            setCustomSize( ! customSize );
            return ! customSize;
        }
    
        if ( customSize ) {
            //check if any preset is exists equivalent to custom fontSize
            let newfontSlug = getMatchArrObjKeyValue( fonSizesArray, 'fontSize', fontSize, 'value' );
            if ( newfontSlug ) {
                onChangeFunc( newfontSlug );
            }
        } else {
            //if theme font size selected then it must be a string but for custom fontsize we require its value
            let newfontSize = getMatchArrObjKeyValue( fonSizesArray, 'value', fontSize, 'fontSize' );
            if ( newfontSize ) {
                onChangeFunc( newfontSize );
            }
        }

        setCustomSize( ! customSize );
    }
    
    //Font size theme preset label 
    let customLabel =  customSize ? __( 'Custom', 'gutena-tabs' ) : getMatchArrObjKeyValue( fonSizesArray, 'value', fontSize, 'label' );
    
    customLabel = ( false === customLabel || ( ! customSize &&  gkIsEmpty( fontSize ) ) ) ? __( 'Default', 'gutena-tabs' ) : '('+ customLabel + ')';

    return (
        reponsive ? 
        <>
            <HStack>
                <FlexItem>
                    <label >
                        { label }
                        <span className="components-font-size-picker__header__hint">{  customLabel }</span>
                    </label>
                    { customSize &&
                        <SelectDeviceDropdown />
                    }
                </FlexItem>
                <FlexItem>
                    <Button
                        label={ customSize ? __( 'Use size preset', 'gutena-tabs' ) : __( 'Set custom size', 'gutena-tabs' ) }
                        icon={  settings }
                        onClick={ () => setCustomFontSize() }
                        isPressed={ customSize }
                        isSmall
                        iconSize={ 24 }
                    />
                </FlexItem>
            </HStack>
            {
                   customSize ?
                    <UnitControl
                        value={  fontSize }
                        onChange={ ( value ) =>  onChangeFunc( value ) }
                    />
                    :
                    <SelectControl
                    value={ fontSize }
                    options={ fonSizesArray }
                    onChange={ ( newSize ) => onChangeFunc( newSize ) }
                    __nextHasNoMarginBottom
                />
                }
        </> :
        <FontSizePicker
            value={ fontSize }
            onChange={ ( value ) => onChangeFunc( value ) }
            disableCustomFontSizes={ false }
            size="__unstable-large"
            __nextHasNoMarginBottom
        />
    );
}
 
export default GutenaFontSizePicker;