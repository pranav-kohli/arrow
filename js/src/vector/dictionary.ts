// Licensed to the Apache Software Foundation (ASF) under one
// or more contributor license agreements.  See the NOTICE file
// distributed with this work for additional information
// regarding copyright ownership.  The ASF licenses this file
// to you under the Apache License, Version 2.0 (the
// "License"); you may not use this file except in compliance
// with the License.  You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.

import { Data } from '../data';
import { View, Vector } from '../vector';
import { IterableArrayLike, DataType, Dictionary, Int } from '../type';

export class DictionaryView<T extends DataType> implements View<T> {
    public indices: Vector<Int>;
    public dictionary: Vector<T>;
    constructor(dictionary: Vector<T>, indices: Vector<Int>) {
        this.indices = indices;
        this.dictionary = dictionary;
    }
    public clone(data: Data<Dictionary<T>>): this {
        return new DictionaryView(data.dictionary, this.indices.clone(data.indices)) as this;
    }
    public isValid(index: number): boolean {
        return this.indices.isValid(index);
    }
    public get(index: number): T['TValue'] {
        return this.dictionary.get(this.indices.get(index));
    }
    public set(index: number, value: T['TValue']): void {
        this.dictionary.set(this.indices.get(index), value);
    }
    public toArray(): IterableArrayLike<T['TValue']> {
        return [...this];
    }
    public *[Symbol.iterator](): IterableIterator<T['TValue']> {
        const values = this.dictionary, indices = this.indices;
        for (let index = -1, n = indices.length; ++index < n;) {
            yield values.get(indices.get(index));
        }
    }
    public indexOf(search: T['TValue']) {
        // First find the dictionary key for the desired value...
        const key = this.dictionary.indexOf(search);
        if (key === -1) { return key; }

        // ... then find the first occurence of that key in indices
        return this.indices.indexOf(key!);
    }
}
