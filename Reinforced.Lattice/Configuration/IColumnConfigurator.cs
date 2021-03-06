﻿using System;
using Reinforced.Lattice.Configuration.Json;

namespace Reinforced.Lattice.Configuration
{
    /// <summary>
    /// Nongeneric interface for column configurator
    /// </summary>
    public interface IColumnConfigurator
    {
        /// <summary>
        /// JSON Column configuration
        /// </summary>
        ColumnConfiguration ColumnConfiguration { get; }
        
        /// <summary>
        /// Reference to main table configurator
        /// </summary>
        NongenericConfigurator TableConfigurator { get; }

        /// <summary>
        /// Retrieves column type
        /// </summary>
        Type ColumnType { get; }

        /// <summary>
        /// Column property information
        /// </summary>
        PropertyDescription ColumnProperty { get; }
    }
}