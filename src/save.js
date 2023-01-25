/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Icon } from '@wordpress/components';
import { RichText, useBlockProps, useInnerBlocksProps } from "@wordpress/block-editor";

/**
 * External dependencies
 */
import classnames from 'classnames';
import { times } from 'lodash';

import parseIcon from './utils/parse-icon';
import { flattenIconsArray } from './utils/icon-functions';
import getIcons from './icons';

export default function save( { attributes } ) {
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
					<li className={ `gutena-tab-title ${ ( 1 + n === activeTab ? 'active' : 'inactive' ) }` } data-tab={ n + 1 } key={ n + 1 }>
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
}
