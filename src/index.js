/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Icon } from '@wordpress/components';
import { registerBlockType } from '@wordpress/blocks';
import { RichText, useBlockProps, useInnerBlocksProps } from "@wordpress/block-editor";

/**
 * External dependencies
 */
import classnames from 'classnames';
import { times } from 'lodash';

import parseIcon from './utils/parse-icon';
import { flattenIconsArray } from './utils/icon-functions';
import getIcons from './icons';

/**
 * Internal dependencies
 */
import metadata from './block.json';
import edit from "./edit";
import save from './save';

/**
 * Styles
 */
import './style.scss'

/**
 * Register Block
 */
registerBlockType( metadata, {
	edit,
    save,
    icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="2" y1="3" x2="2" y2="21" stroke="#0EA489" strokeWidth="2"/>
            <line x1="8.75" y1="3" x2="8.75" y2="9" stroke="#0EA489" strokeWidth="1.5"/>
            <path d="M15.75 3L15.75 9" stroke="#0EA489" strokeWidth="1.5"/>
            <line x1="22" y1="3" x2="22" y2="21" stroke="#0EA489" strokeWidth="2"/>
            <line x1="1" y1="4" x2="22" y2="4" stroke="#0EA489" strokeWidth="2"/>
            <path d="M8 8.25L22 8.25" stroke="#0EA489" strokeWidth="1.5"/>
            <line x1="1" y1="20" x2="22" y2="20" stroke="#0EA489" strokeWidth="2"/>
        </svg>
    ),
	deprecated: [
        {
            attributes: metadata.attributes,
            save: ( { attributes } ) => { 
				const { uniqueId, tabCount, activeTab, titleTabs, tabPosition, tabIcon, tabIconPosition, tabIconSize, tabLayout } = attributes;
                const iconsAll = flattenIconsArray( getIcons() );
                const iconsObj = iconsAll.reduce( ( acc, value ) => {
                    acc[ value?.name ] = value?.icon
                    return acc
                }, {} )

                const renderSVG = ( svg, size ) => {
                    let renderedIcon = iconsObj?.[ svg ];
                    // Icons provided by third-parties are generally strings.
                    if ( typeof renderedIcon === 'string' ) {
                        renderedIcon = parseIcon( renderedIcon );
                    }

                    return <Icon icon={ renderedIcon } size={ size } />;
                }

                const blockProps = useBlockProps.save( {
                    className: classnames( 'gutena-tabs-block', `gutena-tabs-block-${ uniqueId }`, {
                        [ `desktop-${ tabLayout?.desktop }` ]: 'horizontal' !== tabLayout?.desktop,
                        [ `tablet-${ tabLayout?.tablet }` ]: 'default' !== tabLayout?.tablet,
                        [ `mobile-${ tabLayout?.mobile }` ]: 'default' !== tabLayout?.mobile,
                    } ),
                } );

                const innerBlocksProps = useInnerBlocksProps.save( {
                    className: 'gutena-tabs-content'
                } );

                return (
                    <div { ...blockProps }>
                        <ul className={ `gutena-tabs-tab tab-${ tabPosition }` }>
                            { times( tabCount, n => (
                                <li className={ `gutena-tab-title ${ ( 1 + n === activeTab ? 'active' : 'inactive' ) }` } key={ n + 1 }>
                                    <div className={ `gutena-tab-title-content icon-${ tabIconPosition }` }>
                                        {
                                            tabIcon && titleTabs[ n ] && titleTabs[ n ].icon && (
                                                <div className="gutena-tab-title-icon">
                                                    { renderSVG( titleTabs[ n ].icon, tabIconSize ) }
                                                </div>
                                            )
                                        }
                                        <div className="gutena-tab-title-text">
                                            <RichText.Content
                                                tagName="div"
                                                value={ ( titleTabs[ n ] && titleTabs[ n ].text ? titleTabs[ n ].text : '' ) }
                                            />
                                        </div>
                                    </div>
                                </li>
                            ) ) }
                        </ul>
                        <div { ...innerBlocksProps } />
                    </div>
                );
			},
        },
    ],
} );


/**
 * Import Tab Switch
 */
import './switch-tab'