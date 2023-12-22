/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

export interface Definition {
	domains: ReadonlyArray<Domain>;
	version: { major: string; minor: string };
}

export interface Version {
	major: string;
	minor: string;
}

export interface Command {
	name: string;
	description: string;
	experimental?: true;
	deprecated?: boolean;
	parameters?: ReadonlyArray<DataType<false>>;
	returns?: ReadonlyArray<DataType<false>>;
}

export interface Domain {
	domain: string;
	experimental: boolean;
	deprecated?: boolean;
	dependencies?: ReadonlyArray<string>;
	types?: ReadonlyArray<DataType<true>>;
	commands: ReadonlyArray<Command>;
	events: ReadonlyArray<Event>;
}

export type DataType<WithId> =
	| RefType<WithId>
	| ObjectType<WithId>
	| StringType<WithId>
	| ArrayType<WithId>;

export interface Event {
	name: string;
	description: string;
	parameters?: ReadonlyArray<DataType<false>>;
	deprecated?: true;
	experimental?: true;
}

// generic hack -- I would prefer to union/omit, ProtocolType loses the ability
// to discriminate union types when passing through in that way.
export interface IDataType<WithId> {
	name: WithId extends true ? never : string;
	id: WithId extends false ? never : string;
	description?: string;
	optional?: true;
	deprecated?: true;
	experimental?: true;
}

export interface RefType<WithId> extends IDataType<WithId> {
	type: '';
	$ref: string;
}

export interface ObjectType<WithId> extends IDataType<WithId> {
	type: 'object';
	properties: ReadonlyArray<DataType<false>>;
}

export interface StringType<WithId> extends IDataType<WithId> {
	type: 'string';
	enum?: ReadonlyArray<string>;
}

export interface ArrayType<WithId> extends IDataType<WithId> {
	type: 'array';
	items: DataType<false>;
}
