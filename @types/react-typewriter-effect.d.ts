declare module 'react-typewriter-effect' {
    import { Component } from 'react';

    interface TypewriterProps {
        onInit: (typewriter: any) => void;
        options?: {
            loop?: boolean;
            delay?: number;
        };
    }

    export default class Typewriter extends Component<TypewriterProps> {}
} 