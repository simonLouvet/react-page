import { lazyLoad } from '@react-page/editor';
import React from 'react';
import { Editable, useSelected, useFocused } from 'slate-react';

import type { SlateProps } from '../types/component';
import type { SlatePlugin } from '../types/SlatePlugin';
import { useOnKeyDown } from './hotkeyHooks';
import { useRenderElement, useRenderLeave } from './renderHooks';

const HoverButtons = lazyLoad(() => import('./HoverButtons'));

const SlateEditable = React.memo(
  (props: {
    plugins: SlatePlugin[];
    defaultPluginType: string;
    readOnly: boolean;
    placeholder: string;
  }) => {
    const { plugins, defaultPluginType, readOnly, placeholder } = props;
    const injections = {
      useSelected,
      useFocused,
    };
    const renderElement = useRenderElement(
      { plugins, defaultPluginType, injections },
      []
    );
    const renderLeaf = useRenderLeave({ plugins, injections }, []);
    const onKeyDown = useOnKeyDown({ plugins }, []);

    return (
      <Editable
        placeholder={readOnly ? undefined : placeholder}
        readOnly={readOnly}
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        onKeyDown={readOnly ? undefined : onKeyDown}
      />
    );
  }
);

const SlateEditor = (props: SlateProps) => {
  const { plugins, focused, readOnly } = props;

  return (
    <>
      {!readOnly && focused && (
        <HoverButtons
          plugins={props.plugins}
          translations={props.translations}
        />
      )}
      <SlateEditable
        placeholder={props.translations.placeholder}
        readOnly={readOnly}
        plugins={plugins}
        defaultPluginType={props.defaultPluginType}
      />
    </>
  );
};

export default React.memo(SlateEditor);
