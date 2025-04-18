(()=>{"use strict";const e=window.React,t=window.wp.blocks,s=window.wp.i18n,l=window.wp.blockEditor,o=window.wp.components,r=window.wp.data,i=window.wp.coreData,a=JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":2,"name":"post-slider/slider","title":"Post Slider","category":"widgets","icon":"slides","description":"Blog posts slider","keywords":["slider","posts","blog"],"version":"1.0.0","textdomain":"post-slider","attributes":{"postsCount":{"type":"number","default":5},"order":{"type":"string","default":"DESC"},"orderBy":{"type":"string","default":"date"},"categories":{"type":"array","default":[]},"isRandomPosts":{"type":"boolean","default":false}},"supports":{"html":false,"align":["full"]},"editorScript":"file:../../build/post-slider.js","editorStyle":"file:../../assets/css/post-slider-editor.css","style":"file:../../assets/css/post-slider.css"}');(0,t.registerBlockType)(a.name,{...a,edit:({attributes:t,setAttributes:a})=>{const{postsCount:n,order:d,orderBy:p,categories:c,isRandomPosts:m}=t,u=(0,l.useBlockProps)({className:"post-slider-editor"}),g=(0,r.useSelect)((e=>e(i.store).getEntityRecords("taxonomy","category",{per_page:-1})),[]),_=g?g.map((e=>({label:e.name,value:e.id}))):[];return(0,e.createElement)("div",{...u},(0,e.createElement)(l.InspectorControls,null,(0,e.createElement)(o.PanelBody,{title:(0,s.__)("Slider Settings","post-slider"),initialOpen:!0},(0,e.createElement)(o.RangeControl,{label:(0,s.__)("Number of Posts","post-slider"),value:n,onChange:e=>a({postsCount:e}),min:1,max:10}),(0,e.createElement)(o.ToggleControl,{label:(0,s.__)("Random Posts","post-slider"),help:m?(0,s.__)("Displaying random posts from the entire site","post-slider"):(0,s.__)("Displaying posts according to sorting settings","post-slider"),checked:m,onChange:e=>a({isRandomPosts:e})}),!m&&(0,e.createElement)(e.Fragment,null,(0,e.createElement)(o.SelectControl,{label:(0,s.__)("Order","post-slider"),value:d,options:[{label:(0,s.__)("Descending","post-slider"),value:"DESC"},{label:(0,s.__)("Ascending","post-slider"),value:"ASC"}],onChange:e=>a({order:e})}),(0,e.createElement)(o.SelectControl,{label:(0,s.__)("Order By","post-slider"),value:p,options:[{label:(0,s.__)("Date","post-slider"),value:"date"},{label:(0,s.__)("Title","post-slider"),value:"title"},{label:(0,s.__)("Popularity","post-slider"),value:"comment_count"}],onChange:e=>a({orderBy:e})}),_.length>0&&(0,e.createElement)(o.SelectControl,{multiple:!0,label:(0,s.__)("Categories","post-slider"),value:c,options:_,onChange:e=>a({categories:e})})))),(0,e.createElement)("div",{className:"post-slider-editor-preview"},(0,e.createElement)("div",{className:"post-slider-editor-placeholder"},(0,e.createElement)("h2",null,(0,s.__)("Posts Slider","post-slider")),(0,e.createElement)("p",null,(0,s.__)("Displays a slider with the latest blog posts.","post-slider")),m?(0,e.createElement)("p",null,(0,s.__)(`Displaying ${n} random posts from the entire site`,"post-slider")):(0,e.createElement)("p",null,(0,s.__)(`Selected posts: ${n}`,"post-slider")))))},save:()=>null})})();