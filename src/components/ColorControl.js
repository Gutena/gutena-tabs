/**
 * Color controls : Text | Background | link
 */
import { __ } from '@wordpress/i18n';
import {  
    __experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
    __experimentalUseGradient,
} from "@wordpress/block-editor";
import { 
    PanelBody,
    __experimentalToggleGroupControl as ToggleGroupControl,
    __experimentalToggleGroupControlOption as ToggleGroupControlOption,
    __experimentalToolsPanel as ToolsPanel,
} from '@wordpress/components';
import colorSettingsData from './colorSettingsData';

const noop = () => {};

const ColorControl = ( {
    label = __( 'Color', 'gutena-tabs' ),
    attrValue = {},
    colorPanelsSettings = false,
    onChangeFunc = noop,
    panelId = 0,
    enableAlpha = false,
    disableCustomColors = false,
    withPanel = true,
    textColor = true,
    bgColor = true,
    isGradient = true,
    linkColor = true,
    iconColor = false,
} ) => {

    const { gradientValue, setGradient } = __experimentalUseGradient();
    const colorGradientSettings = colorSettingsData();

    //Set attribute
    const setAttr = ( value, attrName ) => {
        let newAttr = attrValue;
        //value = getGlobalColorVar( colorGradientSettings, value );
        //check if active tab has value
        newAttr[ attrName ] = value;
        
        onChangeFunc( { ...newAttr } );
    };

    //Multiple color settings i.e. text, background, link etc
    let colorSettings = [];

    if ( false === colorPanelsSettings ) {
        if ( textColor ) {
            colorSettings.push( {
                colorValue: attrValue?.text,
                onColorChange: ( value ) => setAttr( value, 'text' ),
                label: __("Text", "gutena-tabs"),
            } );
        }

        if ( bgColor ) {
            let gradientSettings = {};
            if ( isGradient ) {
                gradientSettings = { 
                    gradientValue:attrValue?.gradient,
                    onGradientChange: ( value ) => setAttr( value, 'gradient' ), 
                }
            }
            colorSettings.push( {
                colorValue: attrValue?.background,
                onColorChange: ( value ) => setAttr( value, 'background' ),
                label: __("Background", "gutena-tabs"),
                ...gradientSettings
            } );
        }

        if ( linkColor ) {
            colorSettings.push( {
                colorValue: attrValue?.link,
                onColorChange: ( value ) => setAttr( value, 'link' ),
                label: __("Link", "gutena-tabs"),
            } );
        }

        if ( iconColor ) {
            colorSettings.push( {
                colorValue: attrValue?.icon,
                onColorChange: ( value ) => setAttr( value, 'icon' ),
                label: __("Icon", "gutena-tabs"),
            } );
        }
    } else {
        colorSettings = colorPanelsSettings;
    }

    const controls = (
        <ToolsPanel label="" className="gutena-tabs-color-toolpanel" resetAll={ () => onChangeFunc( {} ) } panelId={ panelId } >
            <ColorGradientSettingsDropdown 
                __experimentalHasMultipleOrigins
                __experimentalIsRenderedInSidebar
                settings={ colorSettings }
                disableCustomColors={ disableCustomColors }
                enableAlpha={ enableAlpha }
                panelId={ panelId }
                { ...colorGradientSettings }
            />
        </ToolsPanel>
    );

    if ( withPanel ) {
        return (
            <PanelBody title={ label } initialOpen={ false } >
                { controls }
            </PanelBody>
        );
    }

    return controls;
};

export default ColorControl;