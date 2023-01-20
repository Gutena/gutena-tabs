/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { edit } from '@wordpress/icons';
import { useState } from '@wordpress/element';
import {  
    __experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
    __experimentalUseGradient,
} from "@wordpress/block-editor";
import { 
    Icon,
    PanelBody, 
    BaseControl
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import InserterModal from '../inserters/inserter';
import getIcons from '../icons';
import parseIcon from '../utils/parse-icon';
import { flattenIconsArray } from '../utils/icon-functions';

const noop = () => {};

const IconControl = ( {
    label = __( 'Select Icon', 'gutena-tabs' ),
    panelTitle = __( 'Select Icon', 'gutena-tabs' ),
    value = '',
    onChange= noop,
    onClear = noop,
    withPanel = false,
    initialOpen = false
} ) => {

    const [ isInserterOpen, setInserterOpen ] = useState( false );

    const iconsAll = flattenIconsArray( getIcons() );
	const namedIcon = iconsAll.filter( ( i ) => i.name === value );
	let printedIcon = ! isEmpty( namedIcon ) ? namedIcon[ 0 ].icon : '';

	// Icons provided by third-parties are generally strings.
	if ( typeof printedIcon === 'string' ) {
		printedIcon = parseIcon( printedIcon );
	}

    const controls = (
        <>
            <BaseControl label={ label } className="gutena-icon-picker" __nextHasNoMarginBottom={ true }>
                <div className="icon-picker">
                    <div className="icon-picker__current">
                        {
                            ! isEmpty( printedIcon )
                            ? <span className="icon-picker__icon">
                                <span className="icon-picker__elm">
                                    <Icon icon={ printedIcon } />
                                </span>
                                <span className="icon-picker__del" role="button" onClick={ onClear }>×</span>
                            </span>
                            : <span className="icon-picker__icon--empty">Select</span>
                        }
                    </div>
                    <div className="icon-picker__button" onClick={ () => setInserterOpen( true ) }>
                        <Icon icon={ edit } />
                    </div>
                </div>
            </BaseControl> 
            <InserterModal
				isInserterOpen={ isInserterOpen }
				setInserterOpen={ setInserterOpen }
                value={ value }
                onChange={ onChange }
			/>
        </>
    );

    if ( withPanel ) {
        return (
            <PanelBody title={ panelTitle } initialOpen={ initialOpen }>
                { controls }
            </PanelBody>
        );
    }

    return controls;
};

export default IconControl;