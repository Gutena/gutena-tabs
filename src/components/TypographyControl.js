/**
 * Typography Controls
 */
import { __ } from '@wordpress/i18n';
import {
	__experimentalBlockVariationPicker,
    __experimentalFontFamilyControl as FontFamilyControl,
	__experimentalFontAppearanceControl as FontAppearanceControl,
	__experimentalLetterSpacingControl as LetterSpacingControl,
    __experimentalTextTransformControl as TextTransformControl,
    useSetting,
} from '@wordpress/block-editor';
import {
    PanelBody,
    SelectControl,
    __experimentalGrid as Grid,
    __experimentalUnitControl as UnitControl,
    __experimentalInputControl as InputControl,
    ToggleControl,
    __experimentalHStack as HStack,
    FlexItem,
    Button,
    Dropdown
} from '@wordpress/components';
import { useSelect } from "@wordpress/data";
import { useState } from '@wordpress/element';
import GutenaFontSizePicker  from './GutenaFontSizePicker';
import SelectDeviceDropdown from './SelectDeviceDropdown';
import { questionIcon } from './gutenaIcons';
import { gkIsEmpty, fluidSpacing } from '../utils/helpers';

const DEFAULT_TYPOGRAPHY = {
    fluidTypography: false,
    fontFamily: undefined,
	fontSize: undefined,
    TfontSize: undefined,
    MfontSize: undefined,
    fluidFontSize: undefined,
	lineHeight: undefined,
    TlineHeight: undefined,
    MlineHeight: undefined,
    fontStyle: undefined,
	fontWeight: undefined,
    letterSpacing: undefined,
    textTransform: undefined,
    textDecoration: undefined,
};

const noop = () => {};

const TypographyControl = ( props ) => {
    const {
        label = __( 'Typography', 'gutena-kit' ),
        attrValue = {},
        onChangeFunc = noop,
        hasFontSizeEnabled = true,
        hasAppearanceControl = true,
        hasLetterSpacingControl = true,
        hasLineHeightEnabled = true,
        hasFontFamilyControl = true,
        hasTextTransform = true,
        editGlobalTypography = false,
        makeFluidTypography = false,
        withPanel = true,
        resetButton = true,
        devicePreview = true,
        globalTypography = undefined,
        canReset = false
    } = props;

    const setAttr = ( value, attrName ) => {
        const newattrValue = gkIsEmpty( attrValue ) ? DEFAULT_TYPOGRAPHY : attrValue;
        newattrValue[ attrName ] = value;
        
        //Fluid typography
        if( ! gkIsEmpty( newattrValue.fontSize ) && ( ! gkIsEmpty( newattrValue.MfontSize ) || ! gkIsEmpty( newattrValue.TfontSize ) ) ) {
            newattrValue.fluidFontSize = fluidSpacing( gkIsEmpty( newattrValue.MfontSize ) ? newattrValue.TfontSize: newattrValue.MfontSize, newattrValue.fontSize  );
        }

        onChangeFunc( { ...newattrValue } );
    };

    //Get Device preview type
    const deviceType = useSelect( select => {
        return select( 'core/edit-post' ).__experimentalGetPreviewDeviceType();
    }, [] );

    //If device preview not required
    const [ deviceTypeNoPreview, setDeviceTypeNoPreview ] = useState( 'Desktop' );

    //Local device type based on preview required or not 
    const deviceTypeLocal = devicePreview ? deviceType : deviceTypeNoPreview;

    const deviceChangeFunc = devicePreview ? {} : { 
        deviceTypeLocal: deviceTypeLocal,
        onChangefunc: ( device ) => setDeviceTypeNoPreview( device ) 
    };

    //Save font size and line height according to selected device, if font size is a theme preset then then responsive not require
    const fontSizeName = ( 'Desktop' === deviceTypeLocal || gkIsEmpty( attrValue?.fontSize ) || 10 < attrValue.fontSize.length ) ? 'fontSize' : ( ( 'Tablet' === deviceTypeLocal ) ? 'TfontSize' : 'MfontSize'  );

    const lineHeightName = ( 'Desktop' === deviceTypeLocal || false === editGlobalTypography ) ? 'lineHeight' : ( ( 'Tablet' === deviceTypeLocal ) ? 'TlineHeight' : 'MlineHeight'  );

    const controls = (
        <>
        <Grid columns={ 2 } className="gutena-kit-typography-control">
            { ! gkIsEmpty( globalTypography ) && 0 < globalTypography.length && 
                <div className="edit-site-typography-panel__full-width-control">
                    <SelectControl
                        label={ __( 'Global typography', 'gutena-kit' ) }
                        value={ attrValue?.globalTypography }
                        options={ globalTypography }
                        onChange={ ( value ) => onChangeFunc( { 
                            ...attrValue,
                            fluidTypography: false,
                            globalTypography: value,
                            fontFamily: undefined,
                            fontSize: undefined,
                            TfontSize: undefined,
                            MfontSize: undefined,
                            fluidFontSize: undefined,
                            lineHeight: undefined,
                            TlineHeight: undefined,
                            MlineHeight: undefined,
                            fontStyle: undefined,
                            fontWeight: undefined,
                            letterSpacing: undefined,
                            textTransform: undefined,
                            textDecoration: undefined,
                        } ) }
                        __nextHasNoMarginBottom
                    />
                </div>
            }
            { hasFontFamilyControl && (
                <div className="edit-site-typography-panel__full-width-control">
                    <FontFamilyControl
                        value={ attrValue?.fontFamily }
                        onChange={ ( value ) => setAttr( value, 'fontFamily' ) }
                        size="__unstable-large"
                        __nextHasNoMarginBottom
                    />
                </div>
            ) }
            { hasFontSizeEnabled && (
                <>
                { ! editGlobalTypography && 
                    <div className="edit-site-typography-panel__full-width-control">
                        <GutenaFontSizePicker
                            fontSize={ attrValue?.[ fontSizeName ] }
                            onChangeFunc={ ( value ) => setAttr( value, fontSizeName ) }
                            reponsive={ true }
                            setCustom={ ( ! gkIsEmpty( attrValue?.fontSize ) && 10 > attrValue.fontSize.length ) }
                        />
                    </div>
                }
                { ( editGlobalTypography && 
                    <div>
                        <UnitControl
                            label={
                                <SelectDeviceDropdown 
                                    sideLabel={ __( 'Font size', 'gutena-kit' ) } 
                                    labelAtLeft={ true }
                                    { ...deviceChangeFunc }
                                />
                            }
                            value={ attrValue?.[ fontSizeName ] }
                            onChange={ ( value ) =>  setAttr( value, fontSizeName ) }
                        />
                    </div>
                ) }
                </>
            ) }
            { hasLineHeightEnabled && (
                <div>
                    <InputControl
                        label={ editGlobalTypography 
                            ? <SelectDeviceDropdown 
                                sideLabel={ __( 'Line height', 'gutena-kit' ) } 
                                labelAtLeft={ true }
                                { ...deviceChangeFunc }
                                /> 
                            : __( 'Line height', 'gutena-kit' ) }
                        type="number"
                        value={  attrValue?.[ lineHeightName ] || '' }
                        onChange={ ( value ) => setAttr( value, lineHeightName ) }
                    />
                </div>
            ) }
            { hasLetterSpacingControl && (
                <LetterSpacingControl
                    value={ attrValue?.letterSpacing }
                    onChange={ ( value ) => setAttr( value, 'letterSpacing' ) }
                    size="__unstable-large"
                    __unstableInputWidth="auto"
				/>
            ) }
            { hasTextTransform && (
                <TextTransformControl
                    value={ attrValue?.textTransform }
                    onChange={ ( value ) => setAttr( value, 'textTransform' ) }
				/>
            )}
            { hasAppearanceControl && (
                <div className={ editGlobalTypography ? 'edit-site-typography-panel__full-width-control' : '' }>
                    <FontAppearanceControl
                        value={ {
                            fontStyle:attrValue?.fontStyle,
                            fontWeight:attrValue?.fontWeight,
                        } }
                        onChange={ ( {
                            fontStyle: newFontStyle,
                            fontWeight: newFontWeight,
                        } ) => {
                            let newattrValue = gkIsEmpty( attrValue )
                                ? DEFAULT_TYPOGRAPHY
                                : attrValue;
                                newattrValue.fontStyle = newFontStyle;
                                newattrValue.fontWeight = newFontWeight;
                                onChangeFunc( { ...newattrValue } );
                        } }
                        hasFontStyles={ true }
                        hasFontWeights={ true }
                        __nextHasNoMarginBottom
                    />
                </div>
            ) }

            {  makeFluidTypography && 
                <div className="edit-site-typography-panel__full-width-control">
                    <HStack className="gutena-kit-fluid-typography-toggle-hstack">
                        <FlexItem>
                            <ToggleControl
                                label={ __( 'Make it Fluid Typography', 'gutena-kit' ) }
                                checked={ gkIsEmpty( attrValue?.fluidTypography ) ? false : attrValue?.fluidTypography }
                                onChange={ ( value ) =>  setAttr( value, 'fluidTypography' ) }
                            />
                            <Dropdown
                                className="gutena-kit-popover-help-text"
                                contentClassName="gutena-kit-popover-help-content"
                                position="bottom right"
                                renderToggle={ ( { isOpen, onToggle } ) => (
                                    <Button
                                        variant="link"
                                        onClick={ onToggle }
                                        aria-expanded={ isOpen }
                                        icon={ questionIcon }
                                        iconSize={ 20 }
                                    />
                                ) }
                                renderContent={ () => <div>{  __( 'Create fluid typography using provided minimum and maximum font-size value', 'gutena-kit' ) }</div> }
                            />
                        </FlexItem>
                    </HStack>
                </div>
            }
        </Grid>
        { resetButton && 
            <HStack>
                <FlexItem></FlexItem>
                <FlexItem>
                    <Button 
                        label={  __( 'Reset typography settings', 'gutena-kit' ) }
                        variant="secondary"
                        isSmall
                        disabled={ ! canReset }
                        onClick={ () => onChangeFunc( undefined ) }
                        style={ { 'marginTop': '10px' } }
                    >
                        { __( 'Reset', 'gutena-kit' ) }
                    </Button>
                </FlexItem>
            </HStack>
        }
        </>
    );

    if ( withPanel ) {
        return (
            <PanelBody title={ label } initialOpen={ false }>
                { controls }
            </PanelBody>
        );
    }

    return controls;
}

export default TypographyControl;